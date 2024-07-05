import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Spin, Modal } from 'antd';
import config from '../../../../config';
import useQuery from './../../../../useQuery';

const TraceurEdit = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const query = useQuery();
  const traceurId = query.get('id_traceur');
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
    
    if (!data.code) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    
    setModalVisible(true);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur/traceurOne?id_traceur=${traceurId}`);
        setData(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN,traceurId]);

  const handleConfirmSend = useCallback(async () => {
    try {
      setModalConfirmLoading(true);
      await axios.put(`${DOMAIN}/traceur?id_traceur=${traceurId}`, data);
      toast.success('Le traceur a ete modifié avec succès!');
      navigate('/traceurs');
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
  }, [data, DOMAIN, navigate,traceurId]);

  return (
    <div className="clientForms">
      <ToastContainer />
      <div className="product-container">
        <div className="product-container-top">
          <div className="product-left">
            <h2 className="product-h2">Modification</h2>
            <span>Mettre à jour les informations du traceur</span>
          </div>
        </div>
        <div className="product-wrapper">
          <div>
            <form onSubmit={handleSubmit} className="product-container-bottom">
              {['model', 'numero_serie', 'traceur_id', 'code'].map((field) => (
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
                  />
                </div>
              ))}
              <div className="form-submit">
                <button type="submit" className="btn-submit" disabled={isLoading}>
                  Modifier
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
          <li><strong>Model :</strong> {data?.model}</li>
          <li><strong>Numero de serie :</strong> {data?.numero_serie}</li>
          <li><strong>ID Traceur :</strong> {data?.traceur_id}</li>
          <li><strong>Telephone :</strong> {data?.numero}</li>
          <li><strong>Code :</strong> {data?.code}</li>
        </ul>
      </Modal>
    </div>
  );
};

export default TraceurEdit;
