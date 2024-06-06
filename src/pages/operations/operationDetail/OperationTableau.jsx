import React, { useEffect, useState, useRef } from 'react';
import imgLogo from './../../../assets/falcon.png';
import './operationDetail.scss';
import config from '../../../config';
import axios from 'axios';
import { Popover } from 'antd';
import { DeleteOutlined, SaveOutlined, MailOutlined, FilePdfOutlined } from '@ant-design/icons';
import SignatureCanvas from 'react-signature-canvas';
import html2pdf from 'html2pdf.js';

const OperationDetail = ({ selectedOperations }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [operationsDetails, setOperationsDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const sigCanvas = useRef(null);
  const pdfRef = useRef();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options).toUpperCase();
  };

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

        if (flattenedDetails.length > 0) {
          setClientName(flattenedDetails[0]?.nom_client ?? 'N/A');
          const operationDate = flattenedDetails[0]?.created_at ?? 'N/A';
          setFormattedDate(formatDate(operationDate));
        }
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

  const sendEmail = () => {
    console.log('Envoyer par e-mail :', operationsDetails);
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const element = pdfRef.current;
  
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => new Promise((resolve, reject) => {
      console.log('Image URL:', img.src);
      if (img.complete) {
        resolve();
      } else {
        img.onload = resolve;
        img.onerror = reject;
      }
    }));
  
    Promise.all(imagePromises)
      .then(() => {
        const options = {
          filename: `rapport_${formattedDate}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
        return html2pdf().from(element).set(options).save();
      })
      .then(() => {
        setIsGeneratingPDF(false);
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
        setIsGeneratingPDF(false);
      });
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
    <div className="operationDetail" ref={pdfRef}>
      <div className="operations_row_title">
        <div className="operations_row_img">
          <img src={imgLogo} alt="Logo" className="operations_img" />
        </div>
        <div className="operations_wrapper_title">
          <h2 className="operations_h2">
            RAPPORT SYNTHETIQUE DES INSTALLATIONS ET CONTROLES TECHNIQUES DES TRACKERS EFFECTUEES
            EN DATE DU {formattedDate} SUR LES VEHICULE(S) {clientName.toUpperCase()}
          </h2>
        </div>
      </div>

      {Object.entries(groupedByType).map(([type, details], index) => (
        <div key={type}>
          <h3 style={{ paddingTop: '20px' }}>{index + 1}. {type}</h3>
          <table className="operationTable">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Marque</th>
                <th>Tracker</th>
                <th>Code</th>
                <th>Observation</th>
              </tr>
            </thead>
            <tbody>
              {details.map(detail => (
                <tr key={detail.id_operations}>
                  <td>{detail.matricule ?? 'N/A'}</td>
                  <td>{detail.nom_marque ?? 'N/A'}</td>
                  <td>{detail.numero_serie ?? 'N/A'}</td>
                  <td>{detail.code ?? 'N/A'}</td>
                  <td>{detail.observation ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="images_section">
            {details.map(detail => (
              <div key={detail.id_operations} className="operationDetail_wrapper">
                <div className="operation_row">
                  <span className="operation_span">Matricule: </span>
                  <span className="operation_desc">{detail.matricule ?? 'N/A'}</span>
                </div>
                <div className="operation_row">
                  <span className="operation_span">Photo plaque : </span>
                  <img
                    className="product-img"
                    width={200}
                    height={200}
                    src={`${DOMAIN}${detail.photo_plaque}`}
                    alt="Photo plaque"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/placeholder/image.png'; }}
                  />
                </div>
                <div className="operation_row">
                  <span className="operation_span">Photo traceur : </span>
                  <img
                    className="product-img"
                    width={200}
                    height={200}
                    src={`${DOMAIN}${detail.photo_traceur}`}
                    alt="Photo traceur"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/placeholder/image.png'; }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="signature_section">
        <h3 className='signature_title'>Signature du client</h3>
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
        />
        {!isGeneratingPDF && (
          <div className="no-print">
            <Popover title="Supprimer la signature" trigger="hover">
              <DeleteOutlined onClick={clearSignature} style={{ fontSize: '19px', cursor: 'pointer', margin: '0 10px', color: 'red', border: '1px solid red', borderRadius: '50%', padding: '3px' }} />
            </Popover>
            <Popover title="Sauvegarde" trigger="hover">
              <SaveOutlined onClick={saveSignature} style={{ fontSize: '19px', cursor: 'pointer', margin: '0 10px', border: '1px solid black', borderRadius: '50%', padding: '3px' }} />
            </Popover>
            <Popover title="Envoyer dans le mail" trigger="hover">
              <MailOutlined onClick={sendEmail} style={{ fontSize: '19px', cursor: 'pointer', margin: '0 10px', border: '1px solid black', borderRadius: '50%', padding: '3px' }} />
            </Popover>
            <Popover title="Télécharger en pdf" trigger="hover">
              <FilePdfOutlined onClick={generatePDF} style={{ fontSize: '19px', cursor: 'pointer', margin: '0 10px', color: 'red', border: '1px solid red', borderRadius: '50%', padding: '3px' }} />
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationDetail;
