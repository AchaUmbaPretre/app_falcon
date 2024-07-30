import React, { useEffect, useState } from 'react';
import { Skeleton, Image } from 'antd';
import axios from 'axios';
import moment from 'moment';
import config from '../../../config';

const TraceurHistorique = ({ id_traceur }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur/historique?idTraceur=${id_traceur}`);
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [DOMAIN, id_traceur]);

  if (loading) {
    return <Skeleton active />;
  }


  return (
    <div className="operationDetail">
      {data.length === 0 && <p>Aucun historique disponible pour ce traceur.</p>}
      {data.map((detail) => (
        <div key={detail.id_operations} className="operationDetail_wrapper">
          <div className="operation_row">
            <span className="operation_span">Client : </span>
            <span className="operation_desc">{detail.nom_client ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Superviseur : </span>
            <span className="operation_desc">{detail.superviseur ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Ingénieur : </span>
            <span className="operation_desc">{detail.technicien ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Type d'opération : </span>
            <span className="operation_desc">{detail.nom_type_operations ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Marque : </span>
            <span className="operation_desc">{detail.nom_marque ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Matricule: </span>
            <span className="operation_desc">{detail.matricule ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Traceur : </span>
            <span className="operation_desc">{detail.code ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Numéro attribué: </span>
            <span className="operation_desc">{detail.numero ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Date d'opération : </span>
            <span className="operation_desc">{detail.date_operation ? moment(detail.date_operation).format('DD-MM-YYYY') : 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Kilomètre : </span>
            <span className="operation_desc">{detail.kilometre ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Tension : </span>
            <span className="operation_desc">{detail.tension ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Problème : </span>
            <span className="operation_desc">{detail.probleme ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Observation : </span>
            <span className="operation_desc">{detail.observation ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Photo plaque : </span>
            <Image
              className="product-img"
              width={200}
              height={200}
              src={`${DOMAIN}${detail.photo_plaque}`}
              fallback={`${DOMAIN}/default_image.png`}
            />
          </div>
          <div className="operation_row">
            <span className="operation_span">Photo traceur : </span>
            <Image
              className="product-img"
              width={200}
              height={200}
              src={`${DOMAIN}${detail.photo_traceur}`}
              fallback={`${DOMAIN}/default_image.png`}
            />
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default TraceurHistorique;
