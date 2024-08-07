import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Spin, Modal } from 'antd';
import config from '../../../../config';
import useQuery from './../../../../useQuery';

const ClientEdit = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const query = useQuery();
  const clientId = query.get('id_client');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    if (name === "email") {
      updatedValue = value.toLowerCase();
    } else if (Number.isNaN(Number(value))) {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setData((prev) => ({ ...prev, [name]: updatedValue }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!data.nom_client || !data.telephone) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    
    setModalVisible(true);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/client/clientOne?id_client=${clientId}`);
        setData(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN,clientId]);

  const handleConfirmSend = useCallback(async () => {
    try {
      setModalConfirmLoading(true);
      await axios.put(`${DOMAIN}/client/client?id_client=${clientId}`, data);
      toast.success('Client a ete modifié avec succès!');
      navigate('/client');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;
        toast.error(errorMessage);
      } else {
        toast.error(err.message);
      }
    }
    finally {
      setModalConfirmLoading(false);
      setModalVisible(false);
      setIsLoading(false);
    }
  }, [data, DOMAIN, navigate,clientId]);

  return (
    <div className="clientForms">
      <ToastContainer />
      <div className="product-container">
        <div className="product-container-top">
          <div className="product-left">
            <h2 className="product-h2">Modification</h2>
            <span>Mettre à jour les informations du client</span>
          </div>
        </div>
        <div className="product-wrapper">
          <div>
            <form onSubmit={handleSubmit} className="product-container-bottom">
              {['nom_client', 'nom_principal', 'poste', 'telephone', 'adresse', 'email'].map((field) => (
                <div key={field} className="form-controle">
                  <label htmlFor={field}>
                    {field.replace('_', ' ')} <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={data[field] || ''} 
                    className="form-input"
                    onChange={handleInputChange}
                    required={field !== 'poste' && field !== 'telephone' && field !== 'adresse' && field !== 'email'}
                  />
                </div>
              ))}
              <div className="form-submit">
                <button type="submit" className="btn-submit" disabled={isLoading}>
                  Envoyer
                </button>
                {isLoading && (
                  <div className="loader-container loader-container-center">
                    <Spin size="large" />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        title="Confirmer l'envoi"
        visible={modalVisible}
        confirmLoading={modalConfirmLoading}
        onCancel={() => setModalVisible(false)}
        onOk={handleConfirmSend}
        className="confirmation-modal"
      >
        <p className="modal-text">Voulez-vous envoyer les informations suivantes ?</p>
        <ul>
          <li><strong>Nom du client :</strong> {data.nom_client}</li>
          <li><strong>Nom principal :</strong> {data.nom_principal}</li>
          <li><strong>Poste :</strong> {data.poste}</li>
          <li><strong>Téléphone :</strong> {data.telephone}</li>
          <li><strong>Adresse :</strong> {data.adresse}</li>
          <li><strong>Email :</strong> {data.email}</li>
        </ul>
      </Modal>
    </div>
  );
};

export default ClientEdit;
