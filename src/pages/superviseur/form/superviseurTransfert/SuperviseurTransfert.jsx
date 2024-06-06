import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Modal, Spin } from 'antd';
import { useSelector } from 'react-redux';
import config from '../../../../config';

const SuperviseurTransfert = ({ id_type_operation = 2 }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.currentUser.id);

  const [data, setData] = useState({});
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [traceurs, setTraceurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [idClient, setIdClient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchClients = async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/client`);
      setClients(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVehicules = async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/vehicule`, { params: { id_client: idClient } });
      setVehicules(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTraceurs = async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/traceur`);
      setTraceurs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSites = async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/operation/site`);
      setSites(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/users`);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchTraceurs();
    fetchSites();
    fetchUsers();
  }, [DOMAIN]);

  useEffect(() => {
    if (idClient) {
      fetchVehicules();
    }
  }, [idClient]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prevData) => ({ ...prevData, [name]: file }));
      };
      reader.readAsDataURL(file);
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: type === 'text' ? capitalize(value) : value,
      }));
    }
  };

  useEffect(() => {
    setIdClient(data?.id_client);
  }, [data?.id_client]);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleConfirm = () => setShowConfirmModal(true);
  const handleCancel = () => setShowConfirmModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['id_client', 'site', 'photo_plaque', 'photo_traceur'];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${DOMAIN}/operation`,
        { ...data, id_type_operations: id_type_operation, user_cr: userId },
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Opération créée avec succès!');
      navigate('/operations');
    } catch (err) {
      const errorMessage = err.response?.status === 400 && err.response.data?.message
        ? `L'opération ${data.nom} existe déjà avec ce numéro de téléphone`
        : err.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createOptions = (items, valueKey, labelKey) => items.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }));

  const supervisorOptions = createOptions(users.filter((user) => user.role === 'superviseur'), 'id', 'username');
  const technicienOptions = createOptions(users.filter((user) => user.role === 'technicien'), 'id', 'username');
  const traceurOptions = createOptions(traceurs.filter((t) => t.id_etat_traceur === 2), 'id_traceur', 'numero_serie');
  const clientOptions = createOptions(clients, 'id_client', 'nom_client');
  const siteOptions = createOptions(sites, 'id_site', 'nom_site');
  const vehiculeOptions = vehicules.map((item) => ({
    value: item.id_vehicule,
    label: `Marque : ${item.nom_marque} / Matricule : ${item.matricule}`,
  }));


  return (
    <div className="superviseurInstall">
      <div className="product-container">
        <div className="product-container-top">
          <div className="product-left">
            <h2 className="product-h2">Opération : Transfert</h2>
          </div>
        </div>
        <div className="product-wrapper">
          <div className="product-container-bottom">
            <div className="form-controle">
              <label>Nom client ou société <span style={{ color: 'red' }}>*</span></label>
              <Select
                name="id_client"
                options={clientOptions}
                onChange={({ value }) => handleInputChange({ target: { name: 'id_client', value } })}
                placeholder="Sélectionnez un client..."
              />
            </div>
            <div className="form-controle">
              <label>Site <span style={{ color: 'red' }}>*</span></label>
              <Select
                name="site"
                options={siteOptions}
                onChange={({ value }) => handleInputChange({ target: { name: 'site', value } })}
                placeholder="Sélectionnez un site..."
              />
            </div>
            <div className="form-controle">
              <label>Véhicule <span style={{ color: 'red' }}>*</span></label>
              <Select
                name="id_vehicule"
                options={vehiculeOptions}
                onChange={({ value }) => handleInputChange({ target: { name: 'id_vehicule', value } })}
                placeholder="Sélectionnez un véhicule..."
              />
            </div>
            <div className="form-controle">
              <label>Traceur <span style={{ color: 'red' }}>*</span></label>
              <Select
                name="id_traceur"
                options={traceurOptions}
                onChange={({ value }) => handleInputChange({ target: { name: 'id_traceur', value } })}
                placeholder="Sélectionnez un traceur..."
              />
            </div>
            <div className="form-controle">
              <label>Superviseur <span style={{ color: 'red' }}>*</span></label>
              <Select
                name="id_superviseur"
                options={supervisorOptions}
                onChange={({ value }) => handleInputChange({ target: { name: 'id_superviseur', value } })}
                placeholder="Sélectionnez un superviseur..."
              />
            </div>
            <div className="form-controle">
              <label>Date d'opération <span style={{ color: 'red' }}>*</span></label>
              <input type="date" name="date_operation" className="form-input" onChange={handleInputChange} />
            </div>
            <div className="form-controle">
              <label>Technicien <span style={{ color: 'red' }}>*</span></label>
              <Select
                name="id_technicien"
                options={technicienOptions}
                onChange={({ value }) => handleInputChange({ target: { name: 'id_technicien', value } })}
                placeholder="Sélectionnez un technicien..."
              />
            </div>
            <div className="form-controle">
              <label>Kilometre <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="kilometre" className="form-input" onChange={handleInputChange} />
            </div>
            <div className="form-controle">
              <label>Voltage <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="tension" className="form-input" onChange={handleInputChange} />
            </div>
            <div className="form-controle">
              <label>Photo plaque <span style={{ color: 'red' }}>*</span></label>
              <input type="file" accept=".jpeg, .png, .jpg" name="photo_plaque" className="form-input" onChange={handleInputChange} />
            </div>
            <div className="form-controle">
              <label>Photo traceur <span style={{ color: 'red' }}>*</span></label>
              <input type="file" accept=".jpeg, .png, .jpg" name="photo_traceur" className="form-input" onChange={handleInputChange} />
            </div>
            <div className="form-submit">
              <button className="btn-submit" onClick={handleConfirm} disabled={isLoading}>Envoyer</button>
              {isLoading && (
                <div className="loader-container loader-container-center">
                  <Spin size="large" />
                </div>
              )}
            </div>
            <Modal
              title="Confirmation"
              visible={showConfirmModal}
              onOk={handleSubmit}
              onCancel={handleCancel}
              centered
              cancelText={<span style={{ color: '#fff' }}>Non</span>}
              okText={<span style={{ color: '#fff' }}>Oui</span>}
              cancelButtonProps={{ style: { background: 'red' } }}
              okButtonProps={{ style: { background: 'blue' } }}
            >
              <p>Souhaitez-vous réellement effectuer cette opération ?</p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperviseurTransfert;
