import React, { useEffect, useState } from 'react';
import config from '../../config';
import axios from 'axios';
import { Image, Skeleton } from 'antd';

const PaiementDetail = ({ id_paiement }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState('')

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options).toUpperCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/paiement/one?id_paiement=${id_paiement}`);
        setData(data[0]);
        const operationDate = data[0]?.date_paiement ?? 'N/A';
          setFormattedDate(formatDate(operationDate));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN, id_paiement]);


  return (
    <div className="operationDetail">
      <h1 style={{ padding: '10px 0px', fontSize: "22px" }} className='h2_detail'>Détail du paiement :</h1>
      <Skeleton loading={loading} active>
        <div className="operationDetail_wrapper">
          <div className="operation_row">
            <span className="operation_span">Réference :</span>
            <span className="operation_desc">{data?.ref}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Client :</span>
            <span className="operation_desc">{data?.nom_client}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Montant :</span>
            <span className="operation_desc">{data?.montant} $</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Montant (avec TVA) :</span>
            <span className="operation_desc">{data?.montant_tva} $</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Date :</span>
            <span className="operation_desc">{formattedDate}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Methode :</span>
            <span className="operation_desc">{data?.nom_methode}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">code de transaction :</span>
            <span className="operation_desc">{data?.code_paiement}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Document :</span>
            <Image
              className="product-img"
              width={200}
              height={200}
              src="error"
              fallback={`${DOMAIN}${data?.document}`}
            />
          </div>
        </div>
      </Skeleton>
    </div>
  );
}

export default PaiementDetail;
