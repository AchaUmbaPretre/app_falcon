import React, { useEffect, useState } from 'react'
import './operationDetail.scss'
import config from '../../../config';
import axios from 'axios';
import { Image } from 'antd';

const OperationDetail = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/operation`);
        setData(data[0]);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  console.log(data)

  return (
    <>
      <div className="operationDetail">
        <div className="operationDetail_wrapper">
          <div className="operation_row">
            <span className="operation_span">Client : </span>
            <span className="operation_desc">{data?.nom_client} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Superviseur : </span>
            <span className="operation_desc">{data?.superviseur} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Ingenieur : </span>
            <span className="operation_desc">{data?.technicien} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Type d'opération : </span>
            <span className="operation_desc">{data?.type_operations} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Traceur : </span>
            <span className="operation_desc">{data?.numero_serie} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Numéro : </span>
            <span className="operation_desc">{data?.numero} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Kilometre : </span>
            <span className="operation_desc">{data?.kilometre} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Tension : </span>
            <span className="operation_desc">{data?.tension} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Probleme : </span>
            <span className="operation_desc">{data?.probleme} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Observation : </span>
            <span className="operation_desc">{data?.observations} </span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Photo plaque : </span>
            <Image
              className="product-img"
              width={200}
              height={200}
              src="error"
              fallback={`${DOMAIN}${data?.photo_plaque}`}
            />
          </div>
          <div className="operation_row">
            <span className="operation_span">Photo traceur : </span>
            <Image
              className="product-img"
              width={200}
              height={200}
              src="error"
              fallback={`${DOMAIN}${data?.photo_traceur}`}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default OperationDetail