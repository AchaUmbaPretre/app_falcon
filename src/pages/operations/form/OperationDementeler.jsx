import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

const OperationDementeler = ({id_type_operation}) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({})
  const navigate = useNavigate();
  const [client, setClient] = useState([]);
  const [site, setSite] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [traceur, setTraceur] = useState([]);

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
  
    if (!data.id_client || !data.site ) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
  
    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/operation`, {
        ...data
      });
      toast.success('Opératiion créée avec succès!');
      navigate('/operations');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur`);
        setTraceur(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/operation/site`);
        setSite(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/users`);
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);
  
  return (
    <>
        <div className="clientForm">
          <div className="product-container">
            <div className="product-container-top">
              <div className="product-left">
                <h2 className="product-h2">Une nouvelle opération</h2>
                <span>Créer une nouvelle opération</span>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
                <div className="form-controle">
                  <label htmlFor="">Nom client ou société<span style={{color:'red'}}>*</span></label>
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
                  <label htmlFor="">Site <span style={{color:'red'}}>*</span></label>
                  <Select
                      name="site"
                      options={site?.map((item) => ({
                        value: item.id_site,
                        label: item.nom_site,
                      }))}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: { name: 'site', value: selectedOption.value },
                        })
                      }
                      placeholder="Sélectionnez un site..."
                    />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Traceur <span style={{color:'red'}}>*</span></label>
                  <Select
                      name="id_traceur"
                      options={traceur?.map((item) => ({
                        value: item.id_traceur,
                        label: item.numero_serie,
                      }))}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: { name: 'id_traceur', value: selectedOption.value },
                        })
                      }
                      placeholder="Sélectionnez un traceur..."
                    />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Superviseur <span style={{color:'red'}}>*</span></label>
                  <Select
                      name="id_superviseur"
                      options={users?.map((item) => ({
                        value: item.id,
                        label: item.username,
                      }))}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: { name: 'id_superviseur', value: selectedOption.value },
                        })
                      }
                      placeholder="Sélectionnez un superviseur..."
                    />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Date d'opération <span style={{color:'red'}}>*</span></label>
                  <input type="date" name='date_operation' className="form-input" onChange={handleInputChange} />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Technicien <span style={{color:'red'}}>*</span></label>
                  <Select
                      name="id_technicien"
                      options={users?.map((item) => ({
                        value: item.id,
                        label: item.username,
                      }))}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: { name: 'id_technicien', value: selectedOption.value },
                        })
                      }
                      placeholder="Sélectionnez un technicien..."
                    />
                </div>
                <div className="form-controle">
                    <label htmlFor="">photo plaque <span style={{color:'red'}}>*</span></label>
                    <input type="file" name='photo_plaque' className="form-input" onChange={handleInputChange} />
                </div>
                <div className="form-controle">
                    <label htmlFor="">photo traceur <span style={{color:'red'}}>*</span></label>
                    <input type="file" name='photo_traceur' className="form-input" onChange={handleInputChange} />
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

export default OperationDementeler