import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

const AddModalClient = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({})
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
  
    let updatedValue = fieldValue;
  
    if (fieldName === "email") {
      updatedValue = fieldValue.toLowerCase();
    } else if (Number.isNaN(Number(fieldValue))) {
      updatedValue = fieldValue.charAt(0).toUpperCase() + fieldValue.slice(1);
    }
  
  setData((prev) => ({ ...prev, [fieldName]: updatedValue }));
  };


  const handleClick = async (e) => {
    e.preventDefault();
  
    if (!data.nom_client || !data.telephone ) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
  
    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/client/client`, {
        ...data
      });
      toast.success('Client créé avec succès!');
      navigate('/installation');
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
  }
  
  return (
    <>
        <div className="clientForm">
          <div className="product-container">
            <div className="product-container-top">
              <div className="product-left">
                <h2 className="product-h2">Un nouveau client</h2>
                <span>Créer un nouveau client</span>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
                <div className="form-controle">
                  <label htmlFor="">Nom client ou société<span style={{color:'red'}}>*</span></label>
                  <input type="text" name='nom_client' className="form-input" onChange={handleInputChange}  required/>
                </div>
                <div className="form-controle">
                  <label htmlFor="">Nom principal <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='nom_principal' className="form-input" onChange={handleInputChange}  required/>
                </div>
                <div className="form-controle">
                  <label htmlFor="">Poste <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='poste' className="form-input" onChange={handleInputChange} />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Telephone <span style={{color:'red'}}>*</span></label>
                  <input type="tel" name='telephone' className="form-input" onChange={handleInputChange} required />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Adresse <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='adresse' className="form-input" onChange={handleInputChange} required />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Email <span style={{color:'red'}}>*</span></label>
                  <input type="email" name="email" className="form-input" onChange={handleInputChange} />
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
  )
}

export default AddModalClient