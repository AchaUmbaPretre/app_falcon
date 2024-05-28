import React, { useEffect, useState } from 'react';
import config from '../../../config';
import { Image } from 'antd';
import axios from 'axios';
import moment from 'moment';

const TraceurHistorique = ({ id_traceur }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur/historique?idTraceur=${id_traceur}`);
        setData(data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN, id_traceur]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="operationDetail">
      {data?.map(detail => (
        <div key={detail.id_operations} className="operationDetail_wrapper">
          <div className="operation_row">
            <span className="operation_span">Client : </span>
            <span className="operation_desc">{detail.nom_client ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Superviseur : </span>
            <span className="operation_desc">{detail.superviseur ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Ingenieur : </span>
            <span className="operation_desc">{detail.technicien ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Type d'opération : </span>
            <span className="operation_desc">{detail.nom_type_operations ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Marque : </span>
            <span className="operation_desc">{detail.nom_marque ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Matricule: </span>
            <span className="operation_desc">{detail.matricule ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Traceur : </span>
            <span className="operation_desc">{detail.numero_serie ?? 'N/A'} </span>
          </div>

          <div className="operation_row">
            <span className="operation_span">Telephone: </span>
            <span className="operation_desc">{detail.numero ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Date : </span>
            <span className="operation_desc">{detail.date_operation ? moment(detail.date_operation).format('DD-MM-YYYY') : 'N/A'} </span>
          </div>

          <div className="operation_row">
            <span className="operation_span">Kilometre : </span>
            <span className="operation_desc">{detail.kilometre ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Tension : </span>
            <span className="operation_desc">{detail.tension ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Probleme : </span>
            <span className="operation_desc">{detail.probleme ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Observation : </span>
            <span className="operation_desc">{detail.observation ?? 'N/A'} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Photo plaque : </span>
            <Image
              className="product-img"
              width={200}
              height={200}
              src="error"
              fallback={`${DOMAIN}${detail.photo_plaque}`}
            />
          </div>
          <div className="operation_row">
            <span className="operation_span">Photo traceur : </span>
            <Image
              className="product-img"
              width={200}
              height={200}
              src="error"
              fallback={`${DOMAIN}${detail.photo_traceur}`}
            />
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default TraceurHistorique;
