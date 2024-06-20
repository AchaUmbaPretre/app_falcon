import React, { useEffect, useState } from 'react';
import config from '../../../config';
import axios from 'axios';
import moment from 'moment';
import { Skeleton } from 'antd';

const TraceurDetail = ({ id_traceur }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur?idTraceur=${id_traceur}`);
        setData(data.rows[0]);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN, id_traceur]);

  return (
    <div className="operationDetail">
      <h1 style={{ padding: '10px 0px', fontSize: "22px" }}>Détail</h1>
      <Skeleton loading={loading} active>
        <div className="operationDetail_wrapper">
          <div className="operation_row">
            <span className="operation_span">Model :</span>
            <span className="operation_desc">{data?.model}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Tag :</span>
            <span className="operation_desc">{data?.code}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Numero série :</span>
            <span className="operation_desc">{data?.numero_serie}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Etat du traceur :</span>
            <span className="operation_desc">{data?.nom_etat_traceur}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Date d'entrée :</span>
            <span className="operation_desc">{moment(data?.date_entree).format('DD-MM-YYYY')}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Client :</span>
            <span className="operation_desc">{data?.nom_client ? data.nom_client : "Aucun"}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Marque :</span>
            <span className="operation_desc">{data?.nom_marque ? data.nom_marque : "Aucune"}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Matricule :</span>
            <span className="operation_desc">{data?.matricule ? data.matricule : 'Aucune'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Numero attribué :</span>
            <span className="operation_desc">{data?.numero ? data.numero : 'Aucun'}</span>
          </div>
        </div>
      </Skeleton>
    </div>
  );
}

export default TraceurDetail;
