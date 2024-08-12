import React, { useEffect, useState } from 'react';
import config from '../../../config';
import axios from 'axios';
import './factureCreer.scss'
import icon from './../../../assets/falcon.png'

const FactureCreer = ({ id_facture }) => {

  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <div className="factureCreer">
        <div className="facture_wrapper">
          <div className="facture_logo">
            <img src={icon} alt="" className="facture_img" />
          </div>
          <div className="facture_title_rows">
            <div className="facture_title_div">
              <h1 className="facture_h2">FACTURE N°{data.id_facture}/08/23/KTZ</h1>
            </div>
            <div className="facture_client">
              <h3 className="facture_desc">CLIENT : </h3>
              <div className="facture_client_addr">
                  <span>{data.nom_client}</span>
                  <span>{data.adresse}</span>
              </div>
            </div>
            <h5 className="facture_h5">DOIT POUR CE QUI SUIT : </h5>
            <table>
                <thead>
                    <tr>
                    <th>Réf</th>
                    <th>Qté</th>
                    <th style={{ textAlign: 'center' }}>Description</th>
                    <th>Prix USD</th>
                    <th>Sous-total (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>{data.nombre_vehicules}</td>
                    <td>{data.commentaire}</td>
                    <td>{data.prix_unitaire}</td>
                    <td>{data.sous_total}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="total-row">
                      <td colSpan="4">SOUS-TOTAL USD HT</td>
                      <td>{data.sous_total}</td>
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
      </div>
    </>
  )
}

export default FactureCreer
