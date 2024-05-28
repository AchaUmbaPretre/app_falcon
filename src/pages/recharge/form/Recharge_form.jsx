import './recharge_form.scss'
import iconClient from './../../../assets/client_row.png'
import config from '../../../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Recharge_form() {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [client, setClient] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/recharge/rechargerClient`);
            setClient(data);
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, [DOMAIN]);

  return (
    <>
        <div className="recharge_form">
            <div className="recharge_form_wrapper">
                <h2 className="recharge_client">LISTE DES CLIENTS A RECHARGER</h2>
                <div className="recharge_form_rows">
                {client.map(dd => (
                    <div className="recharge_form_row" onClick={()=> navigate(`/rechargeOne?id_client=${dd.id_client}`)}>
                        <img src={iconClient} alt="" className="recharge_img" />
                        <div className="recharge_form_bottom">
                            <span className="recharge_span">Nom : {dd.nom_client}</span>
                            <span className="recharge_span">Actif : {dd.nbre_actif}</span>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    </>
  )
}

export default Recharge_form