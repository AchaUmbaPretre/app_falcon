import React from 'react'
import rapportImg from './../../../assets/depenses.jpg'
import './rapportDuJour.scss'

const RapportDuJour = () => {
  return (
    <>
        <div className="rapportDuJour">
            <div className="rapport_wrapper">
                <div className="rapport_wrapper_top">
                    <div className="rapport_row">
                        <img src={rapportImg} alt="" className="rapport_img" />
                    </div>
                    <div className="rapport_row">
                        <span className="rapport_montant">100$</span>
                        <span className="rapport_desc">Montant total des dépenses</span>
                    </div>
                </div>
                <div className="rapport_wrapper_bottom">
                    
                </div>
            </div>
        </div>

    </>
  )
}

export default RapportDuJour