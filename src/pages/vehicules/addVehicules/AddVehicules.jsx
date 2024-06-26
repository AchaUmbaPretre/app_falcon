import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { toast, ToastContainer} from 'react-toastify';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const AddVehicules = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [marque, setMarque] = useState([]);
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
        const { data } = await axios.get(`${DOMAIN}/vehicule/marque`);
        setMarque(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

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
    
     if (!data.id_marque || !data.matricule) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    } 

    try{
      setIsLoading(true);
      await axios.post(`${DOMAIN}/vehicule`,{
        ...data
      })

      navigate('/installation');
      toast.success('Vehicule créé avec succès!');
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
        <ToastContainer />
        <div className="clientForm">
          <div className="product-container">
            <div className="product-container-top">
              <div className="product-left">
                <h2 className="product-h2">Un nouveau vehicule</h2>
                <span>Enregistrer un nouveau vehicule</span>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
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
                <div className="form-controle">
                  <label htmlFor="">Marque <span style={{color:'red'}}>*</span></label>
                  <Select
                      name="id_marque"
                      options={marque?.map((item) => ({
                        value: item.id_marque,
                        label: item.nom_marque,
                      }))}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: { name: 'id_marque', value: selectedOption.value },
                        })
                      }
                      placeholder="Sélectionnez une marque..."
                    />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Matricule <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='matricule' className="form-input" onChange={handleInputChange}  required/>
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

export default AddVehicules