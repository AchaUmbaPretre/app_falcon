import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import { Spin } from 'antd';
import './paiementForm.scss';

const PaiementForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const [dataClient, setDataClient] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'email' ? value.toLowerCase() : Number.isNaN(Number(value)) ? value.charAt(0).toUpperCase() + value.slice(1) : value;
    setData((prev) => ({ ...prev, [name]: updatedValue }));
  }, []);

  const fetchClient = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/client`);
      setDataClient(data);
    } catch (error) {
      console.error(error);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <>
      <ToastContainer />
      <div className="paiementForm">
        <div className="product-container">
          <div className="product-container-top">
            <div className="product-left">
              <h2 className="product-h2">Paiement</h2>
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-container-bottom">
              <form onSubmit={handleSubmit} className='form_hand'>
                <div className="form-controle">
                  <label htmlFor="id_client">Client <span style={{ color: 'red' }}>*</span></label>
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
                  <label htmlFor="montant">Montant <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="number"
                    min="0"
                    name="montant"
                    className="form-input"
                    onChange={handleInputChange}
                    required
                    placeholder='ex : 100'
                  />
                </div>

                <div className="form-controle">
                  <label htmlFor="methode">Méthode <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="methode"
                    className="form-input"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-submit">
                  <button type="submit" className="btn-submit" disabled={isLoading}>Envoyer</button>
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
      </div>
    </>
  );
};

export default PaiementForm;
