import React, { useEffect, useState } from 'react'
import './rapport.scss'
import imgRapport from './../../assets/stock-vector-rapport.jpg'
import config from '../../config'
import axios from 'axios'

const Rapport = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN
    const [traceur, setTraceur] = useState([]);
    const [numero, setNumero] = useState([]);
    const [operation, setOperation] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [client, setClient] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const fetchTraceur = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/traceur/count`);
                setTraceur(data);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchNumero = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/affectation/numero_count`);
                setNumero(data[0]?.nbre_numero);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchOperation = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/operation/count`);
                setOperation(data);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchVehicule = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/vehicule/count`);
                setVehicule(data[0]);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchClient = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/client/count`);
                setClient(data[0].nbre_client);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchData = async () => {
            await Promise.all([ fetchTraceur(), fetchNumero(), fetchOperation(), fetchVehicule(), fetchClient()]);
            setLoading(false);
        };

        fetchData();

    },[DOMAIN])

  return (
    <>
        <div className="rapport">
            <div className="rapport_wrapper">
                <h2 className="rapport_title">Rapport</h2>
                <div className="rapport_rows">
                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                        { traceur.map((t)=>(
                            <>
                                <span className="rapport_sous_titles">Traceur</span>
                                <span className="rapport_sous_title">Nbre de traceur : <strong>{t.nbre_traceur}</strong></span>
                                <span className="rapport_sous_title">Actif : <strong>{t.Nbre_actif}</strong></span>
                                <span className="rapport_sous_title">Démentalé : <strong>{t.Nbre_dementele}</strong></span>
                                <span className="rapport_sous_title">Défectueux : <strong>{t.Nbre_defectueux}</strong></span> 
                            </>
                        ))
                        }
                        </div>
                    </div>

                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                            <span className="rapport_sous_titles">Numéro</span>
                            <span className="rapport_sous_title">Nbre de numéro : {numero}</span>
                        </div>
                    </div>

                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                            <span className="rapport_sous_titles">Véhicule</span>
                            <span className="rapport_sous_title">Nbre de vehicule : {vehicule?.nbre_vehicule}</span>
                        </div>
                    </div>

                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                            { operation.map((p)=> (
                                <>
                                    <span className="rapport_sous_titles">Opérations</span>
                                    <span className="rapport_sous_title">Nbre d'opérations : <strong>{p.nbre_operation}</strong></span>
                                    <span className="rapport_sous_title">Installation : <strong>{p.installation}</strong></span>
                                    <span className="rapport_sous_title">Démantèlement : <strong>{p.nbre_dementelement}</strong></span>
                                    <span className="rapport_sous_title">Contrôle technique : <strong>{p.nbre_controle_technique}</strong></span>
                                    <span className="rapport_sous_title">Remplacement : <strong>{p.nbre_remplacement}</strong></span>
                                </>
                            ))
                            }
                        </div>
                    </div>

                    <div className="rapport_row">
                        <img src={imgRapport} alt="" className="rapport_img" />
                        <div className="rapport_rows_info">
                            <span className="rapport_sous_titles">Client</span>
                            <span className="rapport_sous_title">Nbre de client : {client}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Rapport