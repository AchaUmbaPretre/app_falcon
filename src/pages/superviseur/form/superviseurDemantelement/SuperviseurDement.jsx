import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Modal, Spin } from 'antd';
import { useSelector } from 'react-redux';
import config from '../../../../config';

const SuperviseurDement = ({ id_type_operation = 3 }) => {
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
  const [etat, setEtat] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      let updatedValue = value;
      if (name === 'contact_email') {
        updatedValue = value.toLowerCase();
      } else if (isNaN(Number(value)) && typeof value === 'string' && value.length > 0) {
        updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
      }
      setData((prev) => ({ ...prev, [name]: updatedValue }));
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
    fetchData(`${DOMAIN}/traceur/traceurInstall`, setTraceur);
  }, [DOMAIN, fetchData]);

  useEffect(() => {
    fetchData(`${DOMAIN}/operation/site`, setSite);
  }, [DOMAIN, fetchData]);

  useEffect(() => {
    fetchData(`${DOMAIN}/users`, setUsers);
  }, [DOMAIN, fetchData]);

  useEffect(() => {
    fetchData(`${DOMAIN}/traceur/traceur_etat`, setEtat);
  }, [DOMAIN, fetchData]);

  useEffect(() => {
    setIdClient(data?.id_client);
  }, [data?.id_client]);

  const handleConfirm = () => setShowConfirmModal(true);
  const handleCancel = () => setShowConfirmModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.id_vehicule || !data.id_traceur) {
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
      toast.success('Opération créée avec succès!');
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.status === 400 && err.response.data?.message
        ? `Le client ${data.nom} existe déjà avec ce numéro de téléphone`
        : err.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false); // Fermer le modal après le traitement
    }
  };

  const renderSelect = (label, name, options, placeholder) => (
    <div className="form-controle">
      <label>{label} <span style={{ color: 'red' }}>*</span></label>
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
    .filter((t) => t.id_etat_traceur === 7)
    .map((tc) => ({ value: tc.id_traceur, label: tc.code }));

  return (
    <div className="superviseurInstall">
      <div className="product-container">
        <div className="product-container-top">
          <div className="product-left">
            <h2 className="product-h2">Opération : Démentèlement</h2>
          </div>
        </div>
        <div className="product-wrapper">
          <div className="product-container-bottom">
            {renderSelect('Nom client ou société', 'id_client', client.map(({ id_client, nom_client }) => ({ value: id_client, label: nom_client })), 'Sélectionnez un client...')}
            {renderSelect('Véhicule', 'id_vehicule', vehicule.map(({ id_vehicule, nom_marque, matricule }) => ({ value: id_vehicule, label: `Marque : ${nom_marque} / Matricule : ${matricule}` })), 'Sélectionnez un véhicule...')}
            {renderSelect('Site', 'site', site.map(({ id_site, nom_site }) => ({ value: id_site, label: nom_site })), 'Sélectionnez un site...')}
            {renderSelect('Traceur', 'id_traceur', traceurOptions, 'Sélectionnez un traceur...')}
            {renderSelect('Etat du traceur', 'id_etat_traceur', etat.map(({ id_etat_traceur, nom_etat_traceur }) => ({ value: id_etat_traceur, label: nom_etat_traceur })), 'Sélectionnez un état...')}
            {renderSelect('Superviseur', 'id_superviseur', filterUsersByRole('superviseur'), 'Sélectionnez un superviseur...')}
            <div className="form-controle">
              <label>Date d'opération <span style={{ color: 'red' }}>*</span></label>
              <input type="date" name='date_operation' className="form-input" onChange={handleInputChange} />
            </div>
            {renderSelect('Technicien', 'id_technicien', filterUsersByRole('technicien'), 'Sélectionnez un technicien...')}
            <div className="form-controle">
              <label>Photo plaque <span style={{ color: 'red' }}>*</span></label>
              <input type="file" accept=".jpeg, .png, .jpg" name='photo_plaque' className="form-input" onChange={handleInputChange} />
            </div>
            <div className="form-controle">
              <label>Photo traceur <span style={{ color: 'red' }}>*</span></label>
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
            title="Confirmation de l'opération"
            visible={showConfirmModal}
            onOk={handleSubmit}
            onCancel={handleCancel}
            centered
            cancelText={<span style={{ color: '#fff' }}>Non</span>}
            okText={<span style={{ color: '#fff' }}>Oui</span>}
            cancelButtonProps={{ style: { background: 'red', border: 'none', borderRadius: '5px', fontWeight: 'bold' } }}
            okButtonProps={{ style: { background: 'blue', border: 'none', borderRadius: '5px', fontWeight: 'bold' } }}
          >
            <p>Êtes-vous sûr de vouloir démonter ce traceur ? Cette action est irréversible.</p>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default SuperviseurDement;
