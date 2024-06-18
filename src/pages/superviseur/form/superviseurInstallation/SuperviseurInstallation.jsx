import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Modal, Spin } from 'antd';
import config from '../../../../config';
import './superviseurInstallation.scss';
import { useSelector } from 'react-redux';
import AddModalClient from '../../../operations/addModalClient/AddModalClient';
import AddSites from '../../../sites/addSites/AddSites';
import AddVehicules from '../../../vehicules/addVehicules/AddVehicules';
import AddTraceur from '../../../traceur/addTraceur/AddTraceur';

const SuperviseurInstallation = ({ id_type_operation = 1 }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.currentUser.id);

  const [data, setData] = useState({});
  const [client, setClient] = useState([]);
  const [idClient, setIdClient] = useState('');
  const [site, setSite] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [traceur, setTraceur] = useState([]);
  const [vehicule, setVehicule] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSite, setOpenSite] = useState(false);
  const [openVehicule, setOpenVehicule] = useState(false);
  const [openTraceur, setOpenTraceur] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        setData((prev) => ({ ...prev, [name]: file }));
      } else {
        setImagePreview('');
        setData((prev) => ({ ...prev, [name]: null }));
      }
    } else {
      setData((prev) => ({
        ...prev,
        [name]: name === 'contact_email' ? value.toLowerCase() : value,
      }));
    }
  }, []);

  const fetchData = useCallback(async (url, setter) => {
    try {
      const { data } = await axios.get(url);
      setter(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData(`${DOMAIN}/client`, setClient);
  }, [DOMAIN, fetchData]);

  useEffect(() => {
    if (idClient) {
      fetchData(`${DOMAIN}/vehicule?id_client=${idClient}`, setVehicule);
    }
  }, [DOMAIN, idClient, fetchData]);

  useEffect(() => {
    fetchData(`${DOMAIN}/traceur`, setTraceur);
  }, [DOMAIN, fetchData]);

  useEffect(() => {
    fetchData(`${DOMAIN}/operation/site`, setSite);
  }, [DOMAIN, fetchData]);

  useEffect(() => {
    fetchData(`${DOMAIN}/users`, setUsers);
  }, [DOMAIN, fetchData]);

  useEffect(() => {
    setIdClient(data?.id_client);
  }, [data?.id_client]);

  const handleConfirm = () => setShowConfirmModal(true);
  const handleCancel = () => setShowConfirmModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.id_client || !data.site) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${DOMAIN}/operation`,
        {
          ...data,
          id_type_operations: id_type_operation,
          user_cr: userId,
        },
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Opération d\'installation effectuée avec succès !');
      navigate('/installation');
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.status === 400 && err.response.data?.message
        ? `Le client ${data.nom} existe déjà avec ce numéro de téléphone`
        : err.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
    setShowConfirmModal(false);
  };

  const renderSelect = (label, name, options, placeholder, icon = null) => (
    <div className="form-controle">
      <label>{label} <span style={{ color: 'red' }}>*</span> {icon}</label>
      <Select
        name={name}
        options={options}
        onChange={(selectedOption) => handleInputChange({ target: { name, value: selectedOption.value } })}
        placeholder={placeholder}
      />
    </div>
  );

  const filterUsersByRole = (role) => users
    .filter((user) => user.role === role)
    .map((user) => ({ value: user.id, label: user.username }));

    const traceurOptions = traceur
    .filter((t) => t.id_etat_traceur === 1 || t.id_etat_traceur === 2)
    .map((tc) => ({ value: tc.id_traceur, label: tc.code }));

  return (
    <>
      <div className="superviseurInstall">
        <div className="product-container">
          <div className="product-container-top">
            <div className="product-left">
              <h2 className="product-h2">Opération : Installation</h2>
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-container-bottom">
              {renderSelect('Nom client ou société', 'id_client', client.map(({ id_client, nom_client }) => ({ value: id_client, label: nom_client })), 'Sélectionnez un client...', <PlusCircleOutlined onClick={() => setOpen(true)} className='icon_plus' />)}
              {renderSelect('Site', 'site', site.map(({ id_site, nom_site }) => ({ value: id_site, label: nom_site })), 'Sélectionnez un site...', <PlusCircleOutlined onClick={() => setOpenSite(true)} className='icon_plus' />)}
              {renderSelect('Véhicule', 'id_vehicule', vehicule.map(({ id_vehicule, nom_marque, matricule }) => ({ value: id_vehicule, label: `Marque : ${nom_marque} / Matricule : ${matricule}` })), 'Sélectionnez un véhicule...', <PlusCircleOutlined onClick={() => setOpenVehicule(true)} className='icon_plus' />)}
              {renderSelect('Traceur', 'id_traceur', traceurOptions, 'Sélectionnez un traceur...', <PlusCircleOutlined onClick={() => setOpenTraceur(true)} className='icon_plus' />)}
              <div className="form-controle">
                <label>Nomenclature <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name='nomenclature' className="form-input" onChange={handleInputChange} />
              </div>
              {renderSelect('Superviseur', 'id_superviseur', filterUsersByRole('superviseur'), 'Sélectionnez un superviseur...')}
              <div className="form-controle">
                <label>Date d'opération <span style={{ color: 'red' }}>*</span></label>
                <input type="date" name='date_operation' className="form-input" onChange={handleInputChange} />
              </div>
              {renderSelect('Technicien', 'id_technicien', filterUsersByRole('technicien'), 'Sélectionnez un technicien...')}
              <div className="form-controle">
                <label>Kilometre <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name='kilometre' className="form-input" onChange={handleInputChange} />
              </div>
              <div className="form-controle">
                <label>Voltage <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name='tension' className="form-input" onChange={handleInputChange} />
              </div>
              <div className="form-controle">
                <label>photo plaque <span style={{ color: 'red' }}>*</span></label>
                <input type="file" accept=".jpeg, .png, .jpg" name='photo_plaque' className="form-input" onChange={handleInputChange} />
              </div>
              <div className="form-controle">
                <label>photo traceur <span style={{ color: 'red' }}>*</span></label>
                <input type="file" accept=".jpeg, .png, .jpg" name='photo_traceur' className="form-input" onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-submit">
              <button className="btn-submit" onClick={handleConfirm} disabled={isLoading}>Envoyer</button>
              {isLoading && (
                <div className="loader-container loader-container-center">
                  <Spin size="large" />
                </div>
              )}
            </div>
          </div>
          <Modal
            title="Confirmation"
            visible={showConfirmModal}
            onOk={handleSubmit}
            onCancel={handleCancel}
            centered
            cancelText="Non"
            okText="Oui"
            cancelButtonProps={{ style: { background: 'red', color: '#fff' } }}
            okButtonProps={{ style: { background: 'blue', color: '#fff' } }}
          >
            <p>Est-ce que le traceur installé a déjà été configuré ?</p>
            {Object.keys(data).map(key => (
              <p key={key}><strong>{key}:</strong> {data[key]}</p>
            ))}
            {isLoading && (
                <div className="loader-container loader-container-center">
                  <Spin size="large" />
                </div>
              )}
          </Modal>
          <Modal
            title=""
            centered
            open={open}
            onCancel={() => setOpen(false)}
            width={1100}
            footer={null}
          >
            <AddModalClient />
          </Modal>
          <Modal
            title=""
            centered
            open={openSite}
            onCancel={() => setOpenSite(false)}
            width={1000}
            footer={null}
          >
            <AddSites />
          </Modal>

          <Modal
            title=""
            centered
            open={openVehicule}
            onCancel={() => setOpenVehicule(false)}
            width={1000}
            footer={null}
          >
            <AddVehicules />
          </Modal>

          <Modal
            title=""
            centered
            open={openTraceur}
            onCancel={() => setOpenTraceur(false)}
            width={1000}
            footer={null}
          >
            <AddTraceur />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default SuperviseurInstallation;
