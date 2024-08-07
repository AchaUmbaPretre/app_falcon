import React, { useEffect, useState } from 'react';
import config from '../../../../config';
import axios from 'axios';
import { Skeleton } from 'antd';

const RapportClientDetail = ({ id_client }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/client/client_gen?id_client=${id_client}`);
        setData(data[0]);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN, id_client]);


  return (
    <div className="operationDetail">
      <Skeleton loading={loading} active>
        <div className="operationDetail_wrapper">
          <div className="operation_row">
            <span className="operation_span">Client :</span>
            <span className="operation_desc">{data?.nom_client}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Nbre véhicule :</span>
            <span className="operation_desc">{data?.nbre_facture}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Nbre de mois :</span>
            <span className="operation_desc">{data?.nbre_mois}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Nbre d'année :</span>
            <span className="operation_desc">{data?.nbre_annee}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Nbre de facture :</span>
            <span className="operation_desc">{data?.telephone}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Facture total :</span>
            <span className="operation_desc">{data?.montant_total_facture} $</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Total payé :</span>
            <span className="operation_desc">{data?.montant_total_facture} $</span>
          </div>
        </div>
      </Skeleton>
    </div>
  );
}

export default RapportClientDetail;
