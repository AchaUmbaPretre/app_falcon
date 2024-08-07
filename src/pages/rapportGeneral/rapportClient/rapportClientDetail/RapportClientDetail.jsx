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
        const { data } = await axios.get(`${DOMAIN}/client/client_contact?id_client=${id_client}`);
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
            <span className="operation_span">Nom principal :</span>
            <span className="operation_desc">{data?.nom_principal}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Poste :</span>
            <span className="operation_desc">{data?.poste}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Telephone :</span>
            <span className="operation_desc">{data?.telephone}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Adresse :</span>
            <span className="operation_desc">{data?.adresse}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Email :</span>
            <span className="operation_desc">{data?.email}</span>
          </div>
        </div>
      </Skeleton>
    </div>
  );
}

export default RapportClientDetail;
