import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import { Spin, Modal } from 'antd';
import './paiementForm.scss';

const PaiementForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const [dataClient, setDataClient] = useState([]);
  const [methode, setMethode] = useState([]);
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

  const fetchClient = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/client`);
      setDataClient(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  }, [DOMAIN]);

  const fetchMethode = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/paiement/methode`);
      setMethode(data);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchClient();
    fetchMethode();
  }, [fetchClient, fetchMethode]);

  const handleSubmit = async () => {
    if (!data.id_client || !data.montant) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/paiement`, data);
      toast.success('Paiement créé avec succès!');
      navigate('/paiement');
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = () => {
    if (!data.id_client || !data.montant) {
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
            <h2 className="product-h2">Paiement</h2>
          </div>
          <div className="product-wrapper">
            <form className="product-container-bottom form_hand">
              <div className="form-controle">
                <label htmlFor="id_client">
                  Client <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  name="id_client"
                  options={dataClient.map((item) => ({
                    value: item.id_client,
                    label: item.nom_client,
                  }))}
                  onChange={(selectedOption) => setData((prev) => ({ ...prev, id_client: selectedOption.value }))}
                  placeholder="Sélectionnez un client..."
                />
              </div>

              <div className="form-controle">
                <label htmlFor="montant">
                  Montant <span style={{ color: 'red' }}>*</span>
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
                <label htmlFor="methode">
                  Méthode de paiement <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  name="methode"
                  options={methode.map((item) => ({
                    value: item.id_methode,
                    label: item.nom_methode,
                  }))}
                  onChange={(selectedOption) => setData((prev) => ({ ...prev, methode: selectedOption.value }))}
                  placeholder="Sélectionnez une méthode..."
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

export default PaiementForm;
