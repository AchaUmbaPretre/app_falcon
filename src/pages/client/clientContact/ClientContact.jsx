import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spin } from 'antd';

const ClientContact = ({id_client}) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!data.nom_contact || !data.telephone_contact) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/client/clientContact`, { ...data,
        id_client:id_client
       });
      toast.success('Contact créé avec succès!');
      navigate('/client');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        const errorMessage = `Le client ${data.nom} existe déjà avec ce numéro de téléphone`;
        toast.error(errorMessage);
      } else {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="clientForm">
        <div className="product-container">
          <div className="product-container-top">
            <div className="product-left">
              <h2 className="product-h2">Un nouveau contact</h2>
              <span>Créer un nouveau contact</span>
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-container-bottom">
              <div className="form-controle">
                <label htmlFor="nom_contact">Nom <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="nom_contact" id="nom_contact" className="form-input" onChange={handleInputChange} placeholder="Entrez le nom..." />
              </div>
              <div className="form-controle">
                <label htmlFor="poste_contact">Poste <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="poste_contact" id="poste_contact" className="form-input" onChange={handleInputChange} required />
              </div>
              <div className="form-controle">
                <label htmlFor="telephone_contact">Téléphone <span style={{ color: 'red' }}>*</span></label>
                <input type="tel" name="telephone_contact" id="telephone_contact" className="form-input" onChange={handleInputChange} />
              </div>
              <div className="form-controle">
                <label htmlFor="email_contact">Email <span style={{ color: 'red' }}>*</span></label>
                <input type="email" name="email_contact" id="email_contact" className="form-input" onChange={handleInputChange} placeholder="xx@gmail.com" required />
              </div>
            </div>
            <div className="form-submit">
              <button className="btn-submit" onClick={handleClick} disabled={isLoading}>Envoyer</button>
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

export default ClientContact;
