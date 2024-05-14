import React, { useEffect,useState } from 'react';
import './clientForm.scss'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';

const ClientForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({})
  const navigate = useNavigate();
  const [province, setProvince] = useState([]);
  const [idProvince, setIdProvince] = useState([]);
  const [commune, setCommune] = useState([]);
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
    
     if (!data.nom || !data.telephone || !data.id_province) {
      return;
    } 

    try{
      setIsLoading(true);
      await axios.post(`${DOMAIN}/api/client/client`,{
        ...data,
        id_commune : data.commune
      })
      navigate('/clients')
      window.location.reload();

    }catch(err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        const errorMessage = `Le client ${data.nom} existe déjà avec ce numéro de téléphone`;
        
      } else {
        
      }
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/api/livreur/province`);
        setProvince(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  useEffect(()=>{
    setIdProvince(data?.id_province)
  },[data?.id_province])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/api/livreur/commune/${idProvince}`);
        setCommune(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN,idProvince]);
  
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

export default ClientForm