import React, { useEffect, useState, useRef } from 'react';
import imgLogo from './../../../assets/falcon.png';
import './operationDetail.scss';
import config from '../../../config';
import axios from 'axios';
import { Image, Button } from 'antd';
import SignatureCanvas from 'react-signature-canvas';

const OperationDetail = ({ selectedOperations }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [operationsDetails, setOperationsDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const sigCanvas = useRef(null);

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
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedOperations.length > 0) {
      fetchDetails();
    }
  }, [selectedOperations, DOMAIN]);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      alert('Veuillez fournir une signature avant de soumettre.');
    } else {
      const signatureDataUrl = sigCanvas.current.toDataURL();
      console.log(signatureDataUrl);

      axios.post(`${DOMAIN}/operation/signature`, { signature: signatureDataUrl })
        .then(response => {
          console.log('Signature sauvegardée avec succès');
        })
        .catch(error => {
          console.error('Erreur lors de la sauvegarde de la signature:', error);
        });
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (operationsDetails.length === 0) {
    return <p>Aucune opération sélectionnée.</p>;
  }

  const groupedByType = operationsDetails.reduce((acc, detail) => {
    const { type_operations } = detail;
    if (!acc[type_operations]) {
      acc[type_operations] = [];
    }
    acc[type_operations].push(detail);
    return acc;
  }, {});

  return (
    <div className="operationDetail">
      <div className="operations_row_title">
        <div className="operations_row_img">
          <img src={imgLogo} alt="Logo" className="operations_img" />
        </div>
        <div className="operations_wrapper_title">
          <h2 className="operations_h2">
            RAPPORT SYNTHETIQUE DES INSTALLATIONS ET CONTROLES TECHNIQUES DES TRACKERS EFFECTUEES
            EN DATE DU JEUDI 09 MAI 2024 SUR LES VEHICULES CARNAYO
          </h2>
        </div>
      </div>

      {Object.entries(groupedByType).map(([type, details], index) => (
        <div key={type}>
          <h3>{index + 1}. {type}</h3>
          <table className="operationTable">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Traceur</th>
                <th>Code</th>
                <th>Observation</th>
              </tr>
            </thead>
            <tbody>
              {details.map(detail => (
                <tr key={detail.id_operations}>
                  <td>{detail.matricule ?? 'N/A'}</td>
                  <td>{detail.numero_serie ?? 'N/A'}</td>
                  <td>{detail.code ?? 'N/A'}</td>
                  <td>{detail.observation ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {details.map(detail => (
            <div key={detail.id_operations} className="operationDetail_wrapper">
              <div className="operation_row">
                <span className="operation_span">Matricule: </span>
                <span className="operation_desc">{detail.matricule ?? 'N/A'}</span>
              </div>
              <div className="operation_row">
                <span className="operation_span">Photo plaque : </span>
                <Image
                  className="product-img"
                  width={200}
                  height={200}
                  src={`${DOMAIN}${detail.photo_plaque}`}
                  fallback="error"
                />
              </div>
              <div className="operation_row">
                <span className="operation_span">Photo traceur : </span>
                <Image
                  className="product-img"
                  width={200}
                  height={200}
                  src={`${DOMAIN}${detail.photo_traceur}`}
                  fallback="error"
                />
              </div>
              <hr />
            </div>
          ))}
        </div>
      ))}

      <div className="signature_section">
        <h3>Signature du client</h3>
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
        />
        <Button onClick={clearSignature}>Effacer</Button>
        <Button type="primary" onClick={saveSignature}>Enregistrer la signature</Button>
      </div>
    </div>
  );
};

export default OperationDetail;
