import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

const NumeroForm = () => {
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
  
    if (!data.numero) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
  
    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/affectation/numero_post`, {
        ...data
      });
      toast.success('Numéro créé avec succès!');
      navigate('/numero');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        toast.error(err.response);
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
                <h2 className="product-h2">Nouveau numéro</h2>
                <span>Créer un nouveau numéro</span>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
                <div className="form-controle">
                  <label htmlFor="">Numéro <span style={{color:'red'}}>*</span></label>
                  <input type="tel" name='numero' className="form-input" onChange={handleInputChange} placeholder='+243' />
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

export default NumeroForm