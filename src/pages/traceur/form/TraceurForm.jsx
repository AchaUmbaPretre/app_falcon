import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import { Spin } from 'antd';

const TraceurForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState([]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === 'email') {
      updatedValue = value.toLowerCase();
    } else if (isNaN(Number(value))) {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setData((prevData) => ({ ...prevData, [name]: updatedValue }));
  }, []);

  useEffect(() => {

    const fetchModel = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/traceur/traceur_model`);
        setModel(response.data);
      } catch (error) {
        console.error('Error fetching model:', error);
      }
    };
    fetchModel();
  }, [DOMAIN]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.model || !data.numero_serie) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/traceur`, data);
      toast.success('Traceur créé avec succès!');
      navigate('/traceurs');
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
      <div className="clientForm">
        <div className="product-container">
          <div className="product-container-top">
            <div className="product-left">
              <h2 className="product-h2">Un nouveau traceur</h2>
              <span>Enregistrer un nouveau traceur</span>
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-container-bottom">
              <div className="form-controle">
                <label>
                  Model <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  name="model"
                  options={model.map((item) => ({
                    value: item.id_model_traceur,
                    label: item.nom_model,
                  }))}
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: { name: 'model', value: selectedOption.value },
                    })
                  }
                  placeholder="Sélectionnez un model..."
                />
              </div>
              <div className="form-controle">
                <label>
                  Numéro série <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="numero_serie"
                  className="form-input"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-controle">
                <label>
                  Code(nomenclature) <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  className="form-input"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-submit">
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Envoyer
              </button>
              {isLoading && (
                <div className="loader-container loader-container-center">
                  <Spin size="large" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TraceurForm;
