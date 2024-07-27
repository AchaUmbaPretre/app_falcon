import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import { message, Spin, Modal } from 'antd';

const PersonnelForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [telephone, setTelephone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const roles = ['admin', 'secretaire', 'superviseur', 'technicien'];

  const showConfirmationModal = () => {
    setIsConfirmationModalVisible(true);
  };

  const handleConfirm = async () => {
    setIsConfirmationModalVisible(false);
    setIsLoading(true);

    try {
      const res = await axios.post(`${DOMAIN}/users/register`, { username, email, password, role, telephone });
      if (res.data.success) {
        setIsSuccess(true);
        setModalMessage("Personnel enregistré avec succès");
        setIsModalVisible(true);
        setTimeout(() => navigate('/personnel'), 2000);
      } else {
        setIsSuccess(false);
        setModalMessage(res.data.message);
        setIsModalVisible(true);
      }
    } catch (error) {
      setIsSuccess(false);
      setModalMessage("Erreur lors de l'enregistrement.");
      setIsModalVisible(true);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="clientForm">
      <div className="product-container">
        <div className="product-container-top">
          <div className="product-left">
            <h2 className="product-h2">Un nouveau personnel</h2>
            <span>Créer un nouveau personnel</span>
          </div>
        </div>
        <div className="product-wrapper">
          <div className="product-container-bottom">
            <div className="form-controle">
              <label>Nom <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-controle">
              <label>Role <span style={{ color: 'red' }}>*</span></label>
              <select
                name="role"
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Sélectionner un rôle</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="form-controle">
              <label>Téléphone <span style={{ color: 'red' }}>*</span></label>
              <input
                type="tel"
                name="telephone"
                className="form-input"
                onChange={(e) => setTelephone(e.target.value)}
                required
              />
            </div>
            <div className="form-controle">
              <label>Email <span style={{ color: 'red' }}>*</span></label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-controle">
              <label>Mot de passe <span style={{ color: 'red' }}>*</span></label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-submit">
            <button
              className="btn-submit"
              onClick={showConfirmationModal}
              disabled={isLoading}
            >
              Envoyer
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
        title="Confirmation"
        visible={isConfirmationModalVisible}
        onOk={handleConfirm}
        onCancel={() => setIsConfirmationModalVisible(false)}
        okText="Confirmer"
        cancelText="Annuler"
      >
        <p>Nom : {username}</p>
        <p>Rôle : {role}</p>
        <p>Téléphone : {telephone}</p>
        <p>Email : {email}</p>
        <p>Mot de passe : {password}</p>
        <p>Êtes-vous sûr de vouloir enregistrer ces informations ?</p>
      </Modal>
      <Modal
        title={isSuccess ? "Succès" : "Erreur"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        okText="OK"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default PersonnelForm;
