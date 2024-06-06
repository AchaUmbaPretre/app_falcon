import React, { useState, useEffect } from 'react';
import './superviseur.scss';
import config from '../../config';
import installation from './../../assets/installation.png';
import controle from './../../assets/controle.png';
/* import dementelement from './../../assets/démantèlement.png'; */
import dementelement from './../../assets/dement.png';
import transfert from './../../assets/transfert.png';
import remplacement from './../../assets/remplacement.png';
import power from './../../assets/power.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ScrollText from './scrollText/ScrollText';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';

const Superviseur = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [currentUser, setCurrentUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser.username);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate a network request
  }, []);

  const Logout = async () => {
    try {
      await axios.post(`${DOMAIN}/users/logout`);
      setCurrentUser(null);
      localStorage.setItem('persist:root', JSON.stringify(currentUser));
      toast.success('Déconnexion réussie !');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      toast.error('Erreur lors de la déconnexion.');
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="superviseur">
        <div className="superviseur_wrapper">
          <div className="scroll-row">
            <ScrollText username={user} />
          </div>
          <div className="superviseur_rows">
            {isLoading ? (
              <>
                <div className="superviseur_row">
                  <Skeleton.Avatar active size="large" shape="square" />
                  <Skeleton.Input style={{ width: 150 }} active size="small" />
                </div>
                <div className="superviseur_row">
                  <Skeleton.Avatar active size="large" shape="square" />
                  <Skeleton.Input style={{ width: 150 }} active size="small" />
                </div>
                <div className="superviseur_row">
                  <Skeleton.Avatar active size="large" shape="square" />
                  <Skeleton.Input style={{ width: 150 }} active size="small" />
                </div>
                <div className="superviseur_row">
                  <Skeleton.Avatar active size="large" shape="square" />
                  <Skeleton.Input style={{ width: 150 }} active size="small" />
                </div>
                <div className="superviseur_row">
                  <Skeleton.Avatar active size="large" shape="square" />
                  <Skeleton.Input style={{ width: 150 }} active size="small" />
                </div>
                <div className="superviseur_row" onClick={Logout}>
                  <Skeleton.Avatar active size="large" shape="square" />
                  <Skeleton.Input style={{ width: 150 }} active size="small" />
                </div>
              </>
            ) : (
              <>
                <div className="superviseur_row" onClick={() => navigate('/installation')}>
                  <img src={installation} alt="" className="superviseur_img" />
                  <span className="superviseur_span">Installation</span>
                </div>
                <div className="superviseur_row" onClick={() => navigate('/controle_technique')}>
                  <img src={controle} alt="" className="superviseur_img" />
                  <span className="superviseur_span">Controle technique</span>
                </div>
                <div className="superviseur_row" onClick={() => navigate('/demantelement')}>
                  <img src={dementelement} alt="" className="superviseur_img" />
                  <span className="superviseur_span">Démentelement</span>
                </div>
                <div className="superviseur_row" onClick={() => navigate('/remplacement')}>
                  <img src={remplacement} alt="" className="superviseur_img" />
                  <span className="superviseur_span">Remplacement</span>
                </div>
                <div className="superviseur_row" onClick={() => navigate('/transfert')}>
                  <img src={transfert} alt="" className="superviseur_img" />
                  <span className="superviseur_span">Transfert</span>
                </div>
                <div className="superviseur_row" onClick={Logout}>
                  <img src={power} alt="" className="superviseur_img" />
                  <span className="superviseur_span">Déconnecter</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Superviseur;
