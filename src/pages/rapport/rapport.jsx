import React from 'react'
import './rapport.scss'
import imgRapport from './../../assets/stock-vector-rapport.jpg'

const Rapport = () => {
  return (
    <>
        <div className="rapport">
            <div className="rapport_wrapper">
                <h2 className="rapport_title">Rapport</h2>
                <div className="rapport_rows">
                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                            <span className="rapport_sous_titles">Traceur</span>
                            <span className="rapport_sous_title">Nbre de traceur : </span>
                            <span className="rapport_sous_title">Actif :</span>
                            <span className="rapport_sous_title">Démentalé : </span>
                            <span className="rapport_sous_title">Défectueux : </span>
                        </div>
                    </div>

                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                            <span className="rapport_sous_titles">Numéro</span>
                            <span className="rapport_sous_title">Nbre de numéro : </span>
                        </div>
                    </div>

                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                            <span className="rapport_sous_titles">Véhicule</span>
                            <span className="rapport_sous_title">Nbre de vehicule : </span>
                        </div>
                    </div>

                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                            <span className="rapport_sous_titles">Opérations</span>
                            <span className="rapport_sous_title">Nbre d'opérations : </span>
                            <span className="rapport_sous_title">Installation : </span>
                            <span className="rapport_sous_title">Démantèlement : </span>
                            <span className="rapport_sous_title">Contrôle technique : </span>
                            <span className="rapport_sous_title">Remplacement : </span>
                        </div>
                    </div>

                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                            <span className="rapport_sous_title">Traceur</span>
                            <span className="rapport_sous_title">Nbre de traceur : </span>
                            <span className="rapport_sous_title">Actif</span>
                            <span className="rapport_sous_title">Démentalé</span>
                            <span className="rapport_sous_title">Défectueux</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </>
  )
}

export default Rapport