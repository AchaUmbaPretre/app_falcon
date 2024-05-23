import React, { useEffect, useState } from 'react'
import config from '../../../config';
import axios from 'axios';
import { Image } from 'antd';

const ClientDetail = ({id_client}) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataAll, setDataAll] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/client/client_contact?id_client=${id_client}`);
        setData(data[0]);
        setDataAll(data)
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN, id_client]);
  
  const hasAdditionalContactInfo = dataAll.some((dd) => {
    return dd.nom_contact || dd.telephone_contact;
  })

  return (
    <>
      <div className="operationDetail">
        <h1 style={{padding: '10px 0px', fontSize: "22px" }}>Contact principal : </h1>
        <div className="operationDetail_wrapper">
          <div className="operation_row">
            <span className="operation_span">Client : </span>
            <span className="operation_desc">{data?.nom_client} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Poste : </span>
            <span className="operation_desc">{data?.poste} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Telephone : </span>
            <span className="operation_desc">{data?.telephone} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Adresse : </span>
            <span className="operation_desc">{data?.adresse} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Email : </span>
            <span className="operation_desc">{data?.email} </span>
          </div>
        </div>
        { hasAdditionalContactInfo && <div>
            <h1 style={{padding: '20px 0px', fontSize: "22px" }}>Autres contact :</h1>
        <div className="operationDetail_wrapper">
        {dataAll.map((dd, index) => (
            <div key={index} className="operation_row">
            
              <span className="operation_span">Nom : </span>
              <span className="operation_desc">{dd.nom_contact}</span>
              <span className="operation_span">Téléphone : </span>
              <span className="operation_desc">{dd.telephone_contact}</span>
              <span className="operation_span">Poste : </span>
              <span className="operation_desc">{dd.poste_contact}</span>
              <span className="operation_span">Email : </span>
              <span className="operation_desc">{dd.email_contact}</span>
            </div>
          ))}
        </div>
        </div>
        
        }
      </div>
    </>
  )
}

export default ClientDetail