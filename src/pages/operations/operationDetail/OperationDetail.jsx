import React, { useEffect, useState } from 'react';
import './operationDetail.scss';
import config from '../../../config';
import axios from 'axios';
import { Image } from 'antd';

const OperationDetail = ({ selectedOperations }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [operationsDetails, setOperationsDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await Promise.all(
          selectedOperations.map(id =>
            axios.get(`${DOMAIN}/operation?id_client=${id}`).then(response => response.data)
          )
        );
        const flattenedDetails = details.flat();
        setOperationsDetails(flattenedDetails);
        setLoading(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedOperations.length > 0) {
      fetchDetails();
    }
  }, [selectedOperations, DOMAIN]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (operationsDetails.length === 0) {
    return <p>Aucune opération sélectionnée.</p>;
  }

  return (
    <div className="operationDetail">
      {operationsDetails?.map(detail => (
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
            <span className="operation_desc">{detail.type_operations ?? 'N/A'} </span>
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
            <span className="operation_span">Crée(e) par : </span>
            <span className="operation_desc">{detail.user_cr ?? 'N/A'} </span>
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

export default OperationDetail;
