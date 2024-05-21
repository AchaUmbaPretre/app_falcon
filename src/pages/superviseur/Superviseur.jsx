import React, { useEffect, useState } from 'react'
import './superviseur.scss'
import { ExclamationOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import axios from 'axios';

const Superviseur = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState([]);


      const handleClick = async (e) => {
        e.preventDefault();
      }

  return (
    <>
        <div className="pageLivreur">
            <div className="pageLivreur-container">
               <div className="pageLivreur-wrapper">
                { data.length > 0 ?
                    <div className="pageLivreur-message" onClick={handleClick}>
                        Il ya une opération
                        <ExclamationOutlined />
                    </div> :
                    <div className="pageLivreur-message-red">
                        Il n'ya pas d'opération
                        <ExclamationOutlined />
                    </div>
                }
                </div> 
            </div>
        </div>
    </>
  )
}

export default Superviseur