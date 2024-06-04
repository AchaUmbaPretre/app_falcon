import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import { Spin, Modal } from 'antd';

const DepenseForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({ id_users: '', montant: '',montant_franc: '', description: ''});
  const [users, setUsers] = useState([]);
  const [type, setType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'email'
      ? value.toLowerCase()
      : isNaN(Number(value))
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value;
    setData((prev) => ({ ...prev, [name]: updatedValue }));
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${DOMAIN}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [DOMAIN]);

  const fetchType = useCallback(async () => {
    try {
      const response = await axios.get(`${DOMAIN}/depense/type`);
      setType(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchUsers();
    fetchType();
  }, [fetchUsers, fetchType]);

  console.log(data)

  const handleSubmit = async () => {
    if (!data.id_users) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/depense`, data);
      toast.success('Dépense créé avec succès!');
      navigate('/depense');
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = () => {
    if (!data.id_users) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleSubmit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="paiementForm">
        <div className="product-container">
          <div className="product-container-top">
            <h2 className="product-h2">Dépense</h2>
          </div>
          <div className="product-wrapper">
            <form className="product-container-bottom form_hand">
              <div className="form-controle">
                <label htmlFor="id_users">
                  Beneficiaire <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  name="id_users"
                  options={users.map((item) => ({
                    value: item.id,
                    label: item.username,
                  }))}
                  onChange={(selectedOption) => setData((prev) => ({ ...prev, id_users: selectedOption.value }))}
                  placeholder="Sélectionnez un agent..."
                />
              </div>

              <div className="form-controle">
                <label htmlFor="id_categorie">
                  Type de catégorie <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  name="id_categorie"
                  options={type.map((item) => ({
                    value: item.id_categorie_depense,
                    label: item.nom_categorie,
                  }))}
                  onChange={(selectedOption) => setData((prev) => ({ ...prev, id_categorie: selectedOption.value }))}
                  placeholder="Sélectionnez une catégorie..."
                />
              </div>

              <div className="form-controle">
                <label htmlFor="montant">
                  Montant en USD <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  name="montant"
                  className="form-input"
                  onChange={handleInputChange}
                  required
                  placeholder="ex : 100"
                />
              </div>

              <div className="form-controle">
                <label htmlFor="montant">
                  Montant en Franc <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  name="montant_franc"
                  className="form-input"
                  onChange={handleInputChange}
                  required
                  placeholder="ex : 100"
                />
              </div>

              <div className="form-controle">
                <label htmlFor="description">
                  Description <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  name="description"
                  className="form-input"
                  style={{ resize: 'none', height: "150px" }}
                  placeholder='Entrez la description...'
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-submit">
                <button type="button" className="btn-submit" onClick={showModal} disabled={isLoading}>
                  Envoyer
                </button>
                {isLoading && (
                  <div className="loader-container loader-container-center">
                    <Spin size="large" />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        title="Confirmer l'opération"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Oui"
        cancelText="Non"
      >
        <p>Êtes-vous sûr de vouloir effectuer cette opération ?</p>
      </Modal>
    </>
  );
};

export default DepenseForm;
