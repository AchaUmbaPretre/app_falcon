import React from 'react'
import './facturationRecu.scss'
import icon from './../../../assets/falcon.png'

const FacturationRecu = () => {
  return (
    <>
        <div className="facturationRecu">
            <div className="facturation_wrapper">
                <div className="facture_logo">
                    <img src={icon} alt="" className="facture_img" />
                </div>
                <div className="facture_title_rows">
                    <h2 className="facture_title_h2">ETS CRISTAL</h2>
                    <div className="facture_rows_num">
                        <span className="facture_date">Le 10 mai 2024</span>
                        <h3 className="facture_title_h3">RECU N°329/05/24/LMDE</h3>
                    </div>
                    <div className="facture_client">
                        <h3 className="facture_desc"><span>CLIENT</span>: <strong>CAR NAYO</strong></h3>
                    </div>
                    <h5 className="facture_h5">A PAYE CE QUI SUIT : </h5>
                </div>
            </div>
        </div>
    </>
  )
}

export default FacturationRecu