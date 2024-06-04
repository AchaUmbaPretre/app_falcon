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
        console.error('Error fetching operation details:', error);
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
      axios.post(`${DOMAIN}/operation/signature`, { signature: signatureDataUrl })
        .then(response => {
          console.log('Signature saved successfully');
        })
        .catch(error => {
          console.error('Error saving signature:', error);
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
      <div className="operations_row_title">
        <div className="operations_row_img">
          <img src={imgLogo} alt="Logo" className="operations_img" />
        </div>
        <div className="operations_wrapper_title">
          <h2 className="operations_h2">RAPPORT SYNTHETIQUE DES INSTALLATIONS ET CONTROLES TECHNIQUES DES TRACKERS EFFECTUEES EN DATE DU JEUDI 09 MAI 2024 SUR LES VEHICULES CARNAYO</h2>
        </div>
      </div>
      {operationsDetails.map(detail => (
        <div key={detail.id_operations} className="operationDetail_wrapper">
          {[
            ['Client', detail.nom_client],
            ['Superviseur', detail.superviseur],
            ['Ingenieur', detail.technicien],
            ['Type d\'opération', detail.type_operations],
            ['Marque', detail.nom_marque],
            ['Matricule', detail.matricule],
            ['Traceur', detail.numero_serie],
            ['Kilometre', detail.kilometre],
            ['Tension', detail.tension],
            ['Probleme', detail.probleme],
            ['Observation', detail.observation],
            ['Crée(e) par', detail.user_cr],
          ].map(([label, value], index) => (
            <div className="operation_row" key={index}>
              <span className="operation_span">{label} : </span>
              <span className="operation_desc">{value ?? 'N/A'}</span>
            </div>
          ))}
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
