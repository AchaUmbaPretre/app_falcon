import React, { useEffect, useState, useRef } from 'react';
import config from '../../../config';
import axios from 'axios';
import './factureCreer.scss';
import icon from './../../../assets/falcon.png';
import html2pdf from 'html2pdf.js';

const FactureCreer = ({ id_facture }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/facture/recu_facture?id_facture=${id_facture}`);
        setData(data[0]);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [DOMAIN, id_facture]);

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const element = componentRef.current;
    const options = {
      margin: [0.5, 0.5, 0.5, 0.5], // Margins of the PDF
      filename: `facture-${data.id_facture}.pdf`, // Filename for the PDF
      html2canvas: { scale: 2, useCORS: true }, // Ensure CORS is enabled if loading external resources
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <>
      <div className="factureCreer" ref={componentRef}>
        <div className="facture_wrapper">
          <div className="facture_logo" style={{width:"100%", display:'flex', alignItems:'center', justifyContent:'flex-start'}}>
            <img src={icon} alt="" className="facture_img" style={{height:'80px', width:'80px', objectFit:'cover'}} />
          </div>
          <div className="facture_title_rows" style={{width:'100%', display:'flex', flexDirection:'column', gap:'5px'}}>
            <div className="facture_title_div" style={{width:'100%', border:'1px solid #dddddd', padding:'6px', margin:'10px 0px'}}>
              <h1 className="facture_h2" style={{textAlign:'center', fontSize:'.7rem'}}>FACTURE N°{data.id_facture}/08/23/KTZ</h1>
            </div>
            <div className="facture_client" style={{ display:'flex', justifyContent:'space-between', width:'250px', gap:'20px'}}>
              <h3 className="facture_desc" style={{fontSize:'.7rem', textDecoration:'underline'}}>CLIENT:</h3>
              <div className="facture_client_addr" style={{display:'flex', flexDirection:'column', gap:'2px'}}>
                <span style={{fontSize:'.6rem'}}>{data.nom_client}</span>
                <span style={{fontSize:'.6rem'}}>{data.adresse}</span>
              </div>
            </div>
            <h5 className="facture_h5" style={{display:'block', width:'100%', textAlign:'center'}}>DOIT POUR CE QUI SUIT : </h5>
            <table>
              <thead style={{width:'100%', borderCollapse:'collapse', margin:'20px 0', fontSize:'16px', textAlign:'left'}}>
                <tr>
                  <th style={{ border:' 1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>Réf</th>
                  <th style={{ border:' 1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>Qté</th>
                  <th style={{ textAlign: 'center' }}>Description</th>
                  <th style={{ border:' 1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>Prix USD</th>
                  <th style={{ border:' 1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>Sous-total (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border:' 1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>1</td>
                  <td style={{ border:' 1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>{data.nombre_vehicules}</td>
                  <td style={{ border:' 1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>{data.commentaire}</td>
                  <td style={{ border:' 1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>{data.prix_unitaire}</td>
                  <td style={{ border:' 1px solid #dddddd', padding:'8px', fontSize:'.8rem'}}>{data.sous_total}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="total-row" style={{fontWeight:'bold', border:'1px solid #dddddd'}}>
                  <td colSpan="4" style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.7rem'}}>SOUS-TOTAL USD HT</td>
                  <td style={{border:'1px solid #dddddd', padding:'8px', fontSize:'.7rem'}}>{data.sous_total}</td>
                </tr>
                <tr className="total-row">
                  <td colSpan="4">TOTAL USD HT</td>
                  <td>{data.sous_total}</td>
                </tr>
                <tr className="total-row">
                  <td colSpan="4">Taxes (16%)</td>
                  <td>{data.taxe}</td>
                </tr>
                <tr className="total-row">
                  <td colSpan="4">Total (USD)</td>
                  <td>{data.total_usd}</td>
                </tr>
                <tr className="total-row">
                  <td colSpan="4">Total (CDF)</td>
                  <td>{data.total_cdf}</td>
                </tr>
              </tfoot>
            </table>
            <div className="facture_signature">
              <h3>Signature</h3>
            </div>

            <div className="facture_footer">
              <hr />
              <div className="facture_footer_rows">
                <h2>Cash to MADIEME ONEMA Nobel or Payable via M-Pesa au +24382194092</h2>
                <span>ID NAT 01-93-N26910E KNG/RCCM/17-A-04285</span>
                <span>Email : info@falconeyesolutions.com</span>
              </div>
            </div>
          </div>
        </div>
        {!isGeneratingPDF && 
        <div className="facture_actions">
          <button onClick={generatePDF}>Download PDF</button>
        </div> }
      </div>
    </>
  );
}

export default FactureCreer;
