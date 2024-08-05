import React from 'react'
import './factureCreer.scss'
import icon from './../../../assets/falcon.png'

const FactureCreer = () => {
  return (
    <>
      <div className="factureCreer">
        <div className="facture_wrapper">
          <div className="facture_logo">
            <img src={icon} alt="" className="facture_img" />
          </div>
          <div className="facture_title_rows">
            <div className="facture_title_div">
              <h1 className="facture_h2">FACTURE N°328/08/23/KTZ</h1>
            </div>
            <div className="facture_client">
              <h3 className="facture_desc"><span>CLIENT</span>: <strong>CAR NAYO</strong></h3>
            </div>
            <h5 className="facture_h5">DOIT POUR CE QUI SUIT : </h5>
            <table>
                <thead>
                    <tr>
                    <th>Réf</th>
                    <th>Qté</th>
                    <th style={{ textAlign: 'center' }}>Description</th>
                    <th>Status</th>
                    <th>Sous-total (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>5</td>
                    <td>Paiement de la facture CARNAYO N°3065/05/24/LMDE</td>
                    <td>SOLDE</td>
                    <td>$2,168.00</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="total-row">
                    <td colSpan="4">Sous-Total</td>
                    <td>$2,168.00</td>
                    </tr>
                    <tr className="total-row">
                    <td colSpan="4">Taxes (10%)</td>
                    <td>$216.80</td>
                    </tr>
                    <tr className="total-row">
                    <td colSpan="4">Total (USD)</td>
                    <td>$2,384.80</td>
                    </tr>
                    <tr className="total-row">
                    <td colSpan="4">Total (CDF)</td>
                    <td>₲4,769,600.00</td>
                    </tr>
                </tfoot>
            </table>
            <div className="facture_signature">
              <h3>Signature</h3>
            </div>

            <div className="facture_footer">
              <hr />
              <div className="facture_footer_rows">
                <h2>Cash to MADIEME ONEMA Nobel or +24382194092</h2>
                <span>ID NAT 01-93-N26910E KNG/RCCM/17-A-04285</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FactureCreer
