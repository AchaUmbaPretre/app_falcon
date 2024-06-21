import React, { useEffect, useState, useRef, useCallback } from 'react';
import imgLogo from './../../../assets/falcon.png';
import './operationDetail.scss';
import config from '../../../config';
import axios from 'axios';
import { Popover } from 'antd';
import { DeleteOutlined, SaveOutlined, MailOutlined, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons';
import SignatureCanvas from 'react-signature-canvas';
import html2pdf from 'html2pdf.js';
import htmlDocx from 'html-docx-js/dist/html-docx';
import { toast,ToastContainer } from 'react-toastify';

const OperationDetail = ({ selectedOperations }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [operationsDetails, setOperationsDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const sigCanvas = useRef(null);
  const pdfRef = useRef();
  const [idClient, setIdClient] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');

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
            axios.get(`${DOMAIN}/operation?id_operation=${id}`).then(response => response.data)
          )
        );
        const flattenedDetails = details.flat();
        setOperationsDetails(flattenedDetails);

        if (flattenedDetails.length > 0) {
          setIdClient(flattenedDetails[0]?.id_client)
          setClientName(flattenedDetails[0]?.nom_client ?? 'N/A');
          const operationDate = flattenedDetails[0]?.date_operation ?? 'N/A';
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

/*   const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      alert('Veuillez fournir une signature avant de soumettre.');
    } else {
      const signatureDataUrl = sigCanvas.current.toDataURL();

      axios.post(`${DOMAIN}/operation/signature`, { signature: signatureDataUrl, id_client: idClient })
        .then(response => {
          toast.success('Signature sauvegardée avec succès!');
          setSignatureUrl(response.data.signatureUrl); // Mise à jour de l'URL de la signature
        })
        .catch(error => {
          console.error('Erreur lors de la sauvegarde de la signature:', error);
        });
    }
  }; */

  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      alert('Veuillez fournir une signature avant de soumettre.');
    } else {
      const signatureDataUrl = sigCanvas.current.toDataURL();
  
      axios.post(`${DOMAIN}/operation/signature`, { signature: signatureDataUrl, id_client: idClient })
        .then(response => {
          toast.success('Signature sauvegardée avec succès!');
          setSignatureUrl(response.data.signatureUrl); // Mettez à jour l'URL de la signature
        })
        .catch(error => {
          console.error('Erreur lors de la sauvegarde de la signature:', error);
        });
    }
  };
  

  const sendEmail = useCallback(async () => {
    console.log('Envoyer par e-mail :', operationsDetails);
  
    try {
      await axios.post(`${DOMAIN}/operation/send-operation-email`, {
        id_operations: selectedOperations
      });
  
      toast.success('Email envoyé avec succès!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    }
  }, [selectedOperations, DOMAIN]);
  
  

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const element = pdfRef.current;
  
    const options = {
      filename: `rapport_${formattedDate}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
  
    html2pdf().from(element).set(options).save()
      .then(() => {
        setIsGeneratingPDF(false);
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
        setIsGeneratingPDF(false);
      });
  };
  

  const generateDocx = () => {
    const content = pdfRef.current.innerHTML;
  
    // Assurez-vous que signatureUrl est correctement intégré dans le contenu HTML
    const modifiedContent = content.replace('src="signaturePlaceholder"', `src="${signatureUrl}"`);
  
    const docx = htmlDocx.asBlob(modifiedContent);
    const url = URL.createObjectURL(docx);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_${formattedDate}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    <ToastContainer />
      <div className="operations_row_title" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <div className="operations_row_img" style={{width:"100%", paddingLeft:'15px'}}>
          <img src={imgLogo} alt="Logo" className="operations_img" />
        </div>
        <div className="operations_wrapper_title" style={{borderBottom: '1px solid #cecece', width:'80%', margin: "10px 0"}}>
          <h2 className="operations_h2" style={{padding:'10px 0', margin: '0', fontSize:'1rem', color:"red", textAlign:'center', lineHeight:'25px'}}>
            RAPPORT SYNTHETIQUE DES INSTALLATIONS ET CONTROLES TECHNIQUES DES TRACKERS EFFECTUEES
            EN DATE DU {formattedDate} SUR LES VEHICULE(S) {clientName.toUpperCase()}
          </h2>
        </div>
      </div>

      {Object.entries(groupedByType).map(([type, details], index) => (
        <div key={type}>
          <h3 style={{ paddingTop: '20px' }}>{index + 1}. {type}</h3>
          <table className="operationTable" style={{width:'100%', borderCollapse:'collapse', margin:'20px 0', fontSize:'16px', textAlign:'left'}}>
            <thead>
              <tr>
                <th style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>Matricule</th>
                <th style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>Marque</th>
                <th style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>Tracker</th>
                <th style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>Observation</th>
              </tr>
            </thead>
            <tbody>
              {details.map(detail => (
                <tr key={detail.id_operations}>
                  <td style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>{detail.matricule ?? 'N/A'}</td>
                  <td style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>{detail.nom_marque ?? 'N/A'}</td>
                  <td style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>{detail.code ?? 'N/A'}</td>
                  <td style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>{detail.observation ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="images_section">
            {details.map(detail => (
              <div key={detail.id_operations} className="operationDetail_wrapper" style={{width:'100%', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'25px', padding:'10px 0', borderBottom:'1px solid #dddddd'}}>
                <div className="operation_row" style={{width:'100%', display:'flex', flexDirection:'column', gap:'10px', padding:'10px'}}>
                  <span className="operation_span">Matricule: </span>
                  <span className="operation_desc">{detail.matricule ?? 'N/A'}</span>
                </div>
                <div className="operation_row" style={{width:'100%', display:'flex', flexDirection:'column', gap:'10px', padding:'10px'}}>
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
                <div className="operation_row" style={{width:'100%', display:'flex', flexDirection:'column', gap:'10px', padding:'10px'}}>
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
        {signatureUrl ? <img src={signatureUrl} alt="Signature sauvegardée"/> : <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
        />}
      
        {!isGeneratingPDF && (
          <div className="no-print">
            <Popover title="Supprimer la signature" trigger="hover">
              <DeleteOutlined onClick={clearSignature} style={{ fontSize: '19px', cursor: 'pointer', margin: '0 10px', color: 'red', border: '1px solid red', borderRadius: '50%', padding: '3px' }} />
            </Popover>
            <Popover title="Sauvegarde la signature" trigger="hover">
              <SaveOutlined onClick={saveSignature} style={{ fontSize: '19px', cursor: 'pointer', margin: '0 10px', color: 'green', border: '1px solid green', borderRadius: '50%', padding: '3px' }} />
            </Popover>
            <Popover title="Envoyer par mail" trigger="hover">
              <MailOutlined onClick={sendEmail} style={{ fontSize: '19px', cursor: 'pointer', margin: '0 10px', color: '#0056b3', border: '1px solid #0056b3', borderRadius: '50%', padding: '3px' }} />
            </Popover>
            <Popover title="Exporter en PDF" trigger="hover">
              <FilePdfOutlined onClick={generatePDF} style={{ fontSize: '19px', cursor: 'pointer', margin: '0 10px', color: '#b35a00', border: '1px solid #b35a00', borderRadius: '50%', padding: '3px' }} />
            </Popover>
            <Popover title="Exporter en Word" trigger="hover">
              <FileWordOutlined onClick={generateDocx} style={{ fontSize: '19px', cursor: 'pointer', margin: '0 10px', color: '#3b5998', border: '1px solid #3b5998', borderRadius: '50%', padding: '3px' }} />
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationDetail;
