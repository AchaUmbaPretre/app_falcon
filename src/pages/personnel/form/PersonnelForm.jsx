import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import { toast } from 'react-toastify';
import { message, Spin } from 'antd';

const PersonnelForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [telephone, setTelephone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const roles = ['admin', 'secretaire', 'superviseur', 'technicien'];

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`${DOMAIN}/users/register`, { username, email, password, role, telephone });
      if (res.data.success) {
        message.success("Personnel enregistré avec succès");
        navigate('/personnel');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
          </div>
          <div className="form-submit">
            <button
              className="btn-submit"
              onClick={handleClick}
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
    </div>
  );
};

export default PersonnelForm;
