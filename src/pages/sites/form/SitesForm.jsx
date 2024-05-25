import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import { Spin } from 'antd';

const SitesForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({})
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/client`);
        setClient(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const handleClick = async (e) => {
    e.preventDefault();
    
     if (!data.nom_site || !data.id_client) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    } 

    try{
      setIsLoading(true);
      await axios.post(`${DOMAIN}/operation/site`,{
        ...data
      })

      toast.success('Site créé avec succès!');
      navigate('/sites')
      window.location.reload();

    }catch(err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        const errorMessage = `Le traceur ${data.nom} existe déjà avec ce numéro de téléphone`;
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
        <ToastContainer />
          <div className="product-container">
            <div className="product-container-top">
              <div className="product-left">
                <h2 className="product-h2">Un nouveau site</h2>
                <span>Enregistrer un nouveau site</span>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
                <div className="form-controle">
                  <label htmlFor="">Site <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='nom_site' className="form-input" onChange={handleInputChange}  required/>
                </div>
                <div className="form-controle">
                  <label htmlFor="">Client ou société<span style={{color:'red'}}>*</span></label>
                  <Select
                      name="id_client"
                      options={client?.map((item) => ({
                        value: item.id_client,
                        label: item.nom_client,
                      }))}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: { name: 'id_client', value: selectedOption.value },
                        })
                      }
                      placeholder="Sélectionnez un client..."
                    />
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

export default SitesForm