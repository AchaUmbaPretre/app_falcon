import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spin } from 'antd';
import config from '../../../config';
import './clientForms.scss';

const ClientForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    if (name === "email") {
      updatedValue = value.toLowerCase();
    } else if (Number.isNaN(Number(value))) {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setData((prev) => ({ ...prev, [name]: updatedValue }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!data.nom_client || !data.telephone) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    
    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/client/client`, data);
      toast.success('Client créé avec succès!');
      navigate('/client');
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage.includes('déjà') ? `Le client ${data.nom_client} existe déjà avec ce numéro de téléphone` : errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [data, DOMAIN, navigate]);


  return (
    <div className="clientForms">
      <div className="product-container">
        <div className="product-container-top">
          <div className="product-left">
            <h2 className="product-h2">Un nouveau client</h2>
            <span>Créer un nouveau client</span>
          </div>
        </div>
        <div className="product-wrapper">
          <div>
            <form onSubmit={handleSubmit} className="product-container-bottom">
              {['nom_client', 'nom_principal', 'poste', 'telephone', 'adresse', 'email'].map((field) => (
                <div key={field} className="form-controle">
                  <label htmlFor={field}>
                    {field.replace('_', ' ')} <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    className="form-input"
                    onChange={handleInputChange}
                    required={field !== 'poste'}
                  />
                </div>
              ))}
              <div className="form-submit">
                <button type="submit" className="btn-submit" disabled={isLoading}>
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
    </div>
  );
};

export default ClientForm;
