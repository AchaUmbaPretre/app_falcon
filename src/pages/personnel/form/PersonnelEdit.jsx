import React, { useCallback, useEffect, useState } from 'react';
import config from '../../../config';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Spin } from 'antd';
import useQuery from '../../../useQuery';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PersonnelEdit = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const query = useQuery();
  const userId = query.get('userId');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);

  const roles = ['admin', 'secretaire', 'superviseur', 'technicien'];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/users/one?userId=${userId}`);
        setData(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN, userId]);

  const handleConfirmSend = useCallback(async () => {
    try {
      setModalConfirmLoading(true);
      await axios.put(`${DOMAIN}/users/update?userId=${userId}`, data);
      toast.success('Utilisateur a été modifié avec succès!');
      navigate('/personnel');
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;
        toast.error(errorMessage);
      } else {
        toast.error(err.message);
      }
    } finally {
      setModalConfirmLoading(false);
      setModalVisible(false);
      setIsLoading(false);
    }
  }, [data, DOMAIN, navigate, userId]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    setModalVisible(true);
  }, [data]);

  return (
    <>
      <div className="clientForm">
      <ToastContainer />
        <div className="product-container">
          <div className="product-container-top">
            <div className="product-left">
              <h2 className="product-h2">Modification</h2>
              <span>Mettre à jour les informations du personnel</span>
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-container-bottom">
              <div className="form-controle">
                <label htmlFor="">Nom <span style={{color:'red'}}>*</span></label>
                <input
                  type="text"
                  name='username'
                  value={data?.username || ''}
                  className="form-input"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-controle">
                <label htmlFor="">Role <span style={{color:'red'}}>*</span></label>
                <select
                  name='role'
                  className="form-input"
                  value={data?.role || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner un rôle</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="form-controle">
                <label htmlFor="">Telephone <span style={{color:'red'}}>*</span></label>
                <input
                  type="tel"
                  name='telephone'
                  className="form-input"
                  value={data?.telephone || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-controle">
                <label htmlFor="">Email <span style={{color:'red'}}>*</span></label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  onChange={handleInputChange}
                  value={data?.email || ''}
                />
              </div>
            </div>
            <div className="form-submit">
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Modifier
              </button>
              {isLoading && (
                <div className="loader-container loader-container-center">
                  <Spin size="large" />
                </div>
              )}
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
            <li><strong>Nom :</strong> {data.username}</li>
            <li><strong>Téléphone :</strong> {data.telephone}</li>
            <li><strong>Email :</strong> {data.email}</li>
            <li><strong>Role :</strong> {data.role}</li>
          </ul>
        </Modal>
      </div>
    </>
  )
}

export default PersonnelEdit;
