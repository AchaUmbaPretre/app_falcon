import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Modal, Spin } from 'antd';
import { useSelector } from 'react-redux';
import config from '../../../../config';

const SuperviseurRemplace = ({ id_type_operation = 5 }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [client, setClient] = useState([]);
  const [idClient, setIdClient] = useState('');
  const [site, setSite] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [traceur, setTraceur] = useState([]);
  const [vehicule, setVehicule] = useState([]);
  const userId = useSelector((state) => state.user.currentUser.id);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [etat, setEtat] = useState([]);
  const [numero, setNumero] = useState([]);

  const fetchData = useCallback(async (endpoint, setState) => {
    try {
      const { data } = await axios.get(`${DOMAIN}${endpoint}`);
      setState(data);
    } catch (error) {
      console.error(error);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchData('/traceur/traceur_etat', setEtat);
    fetchData('/client', setClient);
    fetchData('/traceur/traceurInstall', setTraceur);
    fetchData(`/operation/site?id_client=${idClient}`, setSite);
    fetchData('/users', setUsers);
    fetchData('/affectation/numero', setNumero);
  }, [fetchData]);

  useEffect(() => {
    if (idClient) {
      fetchData(`/vehicule?id_client=${idClient}`, setVehicule);
    }
  }, [fetchData, idClient]);

  useEffect(() => {
    setIdClient(data?.id_client);
  }, [data?.id_client]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        setData((prev) => ({ ...prev, [name]: file }));
      } else {
        setImagePreview('');
        setData((prev) => ({ ...prev, [name]: null }));
      }
    } else {
      let updatedValue = value;
      if (name === 'contact_email') {
        updatedValue = value.toLowerCase();
      } else if (isNaN(Number(value))) {
        updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
      }
      setData((prev) => ({ ...prev, [name]: updatedValue }));
    }
  };

  const handleConfirm = () => setShowConfirmModal(true);

  const handleCancel = () => setShowConfirmModal(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!data.id_client || !data.site) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/operation`, {
        ...data,
        id_type_operations: id_type_operation,
        user_cr: userId
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Opération créée avec succès!');
      navigate('/operations');
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.status === 400 && err.response.data?.message
        ? `Le client ${data.nom} existe déjà avec ce numéro de téléphone`
        : err.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelect = (label, name, options, placeholder, isRequired = true) => (
    <div className="form-controle">
      <label htmlFor="">{label} {isRequired && <span style={{ color: 'red' }}>*</span>}</label>
      <Select
        name={name}
        options={options}
        onChange={(selectedOption) => handleInputChange({ target: { name, value: selectedOption.value } })}
        placeholder={placeholder}
      />
    </div>
  );

  const supervisorOptions = users
    .filter((user) => user.role === 'superviseur')
    .map((supervisor) => ({
      value: supervisor.id,
      label: supervisor.username,
    }));

  const ingenieurOptions = users
    .filter((user) => user.role === 'technicien')
    .map((technicien) => ({
      value: technicien.id,
      label: technicien.username,
    }));

  return (
    <>
      <div className="clientForm">
        <div className="product-container">
          <div className="product-container-top">
            <div className="product-left">
              <h2 className="product-h2">Opération : Remplacement</h2>
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-container-bottom">
              {renderSelect("Nom client ou société", "id_client", client.map((item) => ({
                value: item.id_client,
                label: item.nom_client,
              })), "Sélectionnez un client...")}
              {renderSelect("Site", "site", site.map((item) => ({
                value: item.id_site,
                label: item.nom_site,
              })), "Sélectionnez un site...")}
              {renderSelect("Véhicule", "id_vehicule", vehicule.map((item) => ({
                value: item.id_vehicule,
                label: `Marque : ${item.nom_marque} / Matricule : ${item.matricule}`,
              })), "Sélectionnez un véhicule...")}
              {renderSelect("Traceur", "id_traceur", traceur.map((item) => ({
                value: item.id_traceur,
                label: item.code,
              })), "Sélectionnez un traceur...")}
              {renderSelect("Etat du traceur", "id_etat_traceur", etat.map((item) => ({
                value: item.id_etat_traceur,
                label: item.nom_etat_traceur,
              })), "Sélectionnez un état...")}
              {renderSelect("Superviseur", "id_superviseur", supervisorOptions, "Sélectionnez un superviseur...")}
              <div className="form-controle">
                <label htmlFor="">Date d'opération <span style={{ color: 'red' }}>*</span></label>
                <input type="date" name='date_operation' className="form-input" onChange={handleInputChange} />
              </div>
              {renderSelect("Technicien", "id_technicien", ingenieurOptions, "Sélectionnez un technicien...")}
              <div className="form-controle">
                <label htmlFor="">Qu'est-ce que tu veux changer ? <span style={{ color: 'red' }}>*</span></label>
                <div>
                  <input
                    type="radio"
                    id="numero"
                    name="changeOption"
                    value="numero"
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <label htmlFor="numero">Numéro</label>
                  <input
                    type="radio"
                    id="traceur_echange"
                    name="changeOption"
                    value="traceur_echange"
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <label htmlFor="traceur_echange">Traceur d'échange</label>
                </div>
              </div>
              {selectedOption === "numero" && renderSelect("Numéro", "id_numero_nouveau", numero.map((item) => ({
                value: item.id_numero,
                label: item.numero,
              })), "Sélectionnez un numéro...")}
              {selectedOption === "traceur_echange" && renderSelect("Traceur d'échange", "traceur_nouveau", traceur.map((item) => ({
                value: item.id_traceur,
                label: item.numero_serie,
              })), "Sélectionnez un traceur d'échange...")}
              <div className="form-controle">
                <label htmlFor="">Problème <span style={{ color: 'red' }}>*</span></label>
                <textarea name='probleme' className="form-input" onChange={handleInputChange} style={{ height: "100px", resize: 'none' }} />
              </div>
              <div className="form-controle">
                <label htmlFor="">Observation <span style={{ color: 'red' }}>*</span></label>
                <textarea name='observation' className="form-input" onChange={handleInputChange} style={{ height: "100px", resize: 'none' }} />
              </div>
              <div className="form-controle">
                <label htmlFor="">Photo plaque <span style={{ color: 'red' }}>*</span></label>
                <input type="file" accept=".jpeg, .png, .jpg" name='photo_plaque' className="form-input" onChange={handleInputChange} />
              </div>
              <div className="form-controle">
                <label htmlFor="">Photo traceur <span style={{ color: 'red' }}>*</span></label>
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
            <Modal
              title="Confirmation"
              visible={showConfirmModal}
              onOk={handleClick}
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
    </>
  );
}

export default SuperviseurRemplace;
