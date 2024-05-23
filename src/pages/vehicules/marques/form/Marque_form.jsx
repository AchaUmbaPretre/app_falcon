import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spin } from 'antd';
import config from '../../../../config';

const Marque_form = () => {
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
    
     if (!data.nom_marque) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    } 

    try{
      setIsLoading(true);
      await axios.post(`${DOMAIN}/vehicule/marque`,{
        ...data
      })

      toast.success('Marque créée avec succès!');
      navigate('/marques')
      window.location.reload();

    }catch(err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        const errorMessage = `La marque ${data.nom} existe déjà`;
        toast.error(errorMessage);
      } else {
        toast.error(err.message);
      }
    }
    finally {
      setIsLoading(false);
    }
  }
  
  return (
    <>
        <div className="clientForm">
          <div className="product-container">
            <div className="product-container-top">
              <div className="product-left">
                <h2 className="product-h2">Nouvelle marque</h2>
                <span>Enregistrer une nouvelle marque</span>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
                <div className="form-controle">
                  <label htmlFor="">Marque <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='nom_marque' className="form-input" onChange={handleInputChange} placeholder='Entrez une nouvelle marque...'  required/>
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

export default Marque_form