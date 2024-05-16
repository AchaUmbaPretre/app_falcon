import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const ClientContact = () => {
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
  }
  
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
                  <label htmlFor="">Nom <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='nom_contact' className="form-input" onChange={handleInputChange}  required/>
                </div>
                <div className="form-controle">
                  <label htmlFor="">Poste <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='poste_contact' className="form-input" onChange={handleInputChange}  required/>
                </div>
                <div className="form-controle">
                  <label htmlFor="">Telephone <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='telephone_contact' className="form-input" onChange={handleInputChange} />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Email <span style={{color:'red'}}>*</span></label>
                  <input type="tel" name='email_contact' className="form-input" onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-submit">
                <button className="btn-submit" onClick={handleClick} disabled={isLoading}>Envoyer</button>
                {isLoading && (
                <div className="loader-container loader-container-center">
{/*                   <CircularProgress size={28} /> */}
                </div>
            )}
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default ClientContact