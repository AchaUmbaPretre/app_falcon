import React, { useEffect, useState } from 'react'
import './pageLivreur.scss'
import { ExclamationOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';

const Superviseur = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [commande, setCommande] = useState([]);
    const userId = useSelector((state) => state.user.currentUser.id);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`${DOMAIN}/api/livraison/livraison-user/${userId}`);
          setData(data);
          const Idcommande = data.map((dd) => dd.id_commande);
          setCommande(Idcommande[0]);
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchData();
    
      const intervalId = setInterval(fetchData, 4000);
    
      return () => clearInterval(intervalId);
    }, [DOMAIN,userId]);

      const handleClick = async (e) => {
        e.preventDefault();

        try{
          await axios.put(`${DOMAIN}/api/livreur/putStatut/${commande}`)

          navigate('/pageLivreurVente')

        }catch(err) {
          Swal.fire({
            title: 'Error',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
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