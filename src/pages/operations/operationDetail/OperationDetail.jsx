import React, { useEffect, useState, useRef } from 'react';
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

  return (
    <div className="operationDetail">
      {operationsDetails.map(detail => (
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
            <span className="operation_span">Ingenieur : </span>
            <span className="operation_desc">{detail.technicien ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Type d'opération : </span>
            <span className="operation_desc">{detail.type_operations ?? 'N/A'}</span>
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
            <span className="operation_desc">{detail.numero_serie ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Kilometre : </span>
            <span className="operation_desc">{detail.kilometre ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Tension : </span>
            <span className="operation_desc">{detail.tension ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Probleme : </span>
            <span className="operation_desc">{detail.probleme ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Observation : </span>
            <span className="operation_desc">{detail.observation ?? 'N/A'}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Crée(e) par : </span>
            <span className="operation_desc">{detail.user_cr ?? 'N/A'}</span>
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
