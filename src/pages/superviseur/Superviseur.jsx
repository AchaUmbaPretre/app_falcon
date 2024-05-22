import React, { useState } from 'react'
import './superviseur.scss'
import config from '../../config';
import installation from './../../assets/installation.png'
import controle from './../../assets/controle.png'
import dementelement from './../../assets/démantèlement.png'
import transfert from './../../assets/transfert.png'
import remplacement from './../../assets/remplacement.png'
import { useNavigate } from 'react-router-dom';

const Superviseur = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState([]);
    const navigate = useNavigate();


      const handleClick = async (e) => {
        e.preventDefault();
      }

  return (
    <>
        <div className="superviseur">
            <div className="superviseur_wrapper">
                <div className="superviseur_rows">
                    <div className="superviseur_row" onClick={()=>navigate('/installation')}>
                        <img src={installation} alt="" className="superviseur_img" />
                        <span className="superviseur_span">Installation</span>
                    </div>
                    <div className="superviseur_row">
                        <img src={controle} alt="" className="superviseur_img" />
                        <span className="superviseur_span">Controle technique</span>
                    </div> 
                    <div className="superviseur_row">
                        <img src={dementelement} alt="" className="superviseur_img" />
                        <span className="superviseur_span">Démentelement</span>
                    </div> 
                    <div className="superviseur_row">
                        <img src={remplacement} alt="" className="superviseur_img" />
                        <span className="superviseur_span">Remplacement</span>
                    </div> 
                </div>
            </div>
        </div>
    </>
  )
}

export default Superviseur