import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import { Spin } from 'antd';

const TraceurForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({})
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [etat, setEtat] = useState([]);
  const [model, setModel] = useState([]);

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
        const { data } = await axios.get(`${DOMAIN}/traceur/traceur_etat`);
        setEtat(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur/traceur_model`);
        setModel(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const handleClick = async (e) => {
    e.preventDefault();
    
     if (!data.model || !data.numero_serie) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    } 

    try{
      setIsLoading(true);
      await axios.post(`${DOMAIN}/traceur`,{
        ...data
      })

      toast.success('Traceur créé avec succès!');
      navigate('/traceurs')
      window.location.reload();

    }catch(err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
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
                <h2 className="product-h2">Un nouveau traceur</h2>
                <span>Enregistrer un nouveau traceur</span>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
                <div className="form-controle">
                  <label htmlFor="">Model <span style={{color:'red'}}>*</span></label>
                  <Select
                      name="model"
                      options={model?.map((item) => ({
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
                  <label htmlFor="">Numéro serie <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='numero_serie' className="form-input" onChange={handleInputChange}  required/>
                </div>

                <div className="form-controle">
                  <label htmlFor="">Code <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='code' className="form-input" onChange={handleInputChange}  required/>
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

export default TraceurForm