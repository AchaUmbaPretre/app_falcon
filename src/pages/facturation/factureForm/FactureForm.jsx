import React, { useState, useEffect } from 'react';
import './factureForm.scss'
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { Input } from 'antd';

function FactureForm() {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [clients, setClients] = useState([]);
    const [produits, setProduits] = useState([]);
    const [remises, setRemises] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [factureDetails, setFactureDetails] = useState([]);

    useEffect(() => {
        axios.get(`${DOMAIN}/client`).then(response => setClients(response.data));
/*         axios.get('/produits').then(response => setProduits(response.data));
        axios.get('/remises').then(response => setRemises(response.data));
        axios.get('/taxes').then(response => setTaxes(response.data)); */
    }, []);

    const addDetail = () => {
        setFactureDetails([...factureDetails, { produit: null, quantite: 1, remise: null, taxe: null }]);
    };

    const handleDetailChange = (index, field, value) => {
        const newDetails = [...factureDetails];
        newDetails[index][field] = value;
        setFactureDetails(newDetails);
    };

    const createFacture = () => {
        const date_facture = new Date().toISOString().split('T')[0];
        const details = factureDetails.map(detail => ({
            produit_id: detail.produit.value,
            quantite: detail.quantite,
            prix_unitaire: produits.find(p => p.id === detail.produit.value).prix,
            remise_id: detail.remise ? detail.remise.value : null,
            taxe_id: detail.taxe ? detail.taxe.value : null
        }));
        axios.post('/factures', { client_id: selectedClient.value, date_facture, details })
            .then(response => {
                console.log('Facture créée:', response.data);
            });
    };

    return (
       <>
            <div className="factureForm">
                <div className="factureForm_container">
                    <div className="factureForm_top">
                        <h2 className="facture_h2">Créer une nouvelle facture</h2>
                    </div>
                    <div className="factureForm_wrapper">
                        <div>
                            <form className='factureForm'>
                                <div className="facture_controle">
                                    <label htmlFor="" className="facture_label">Client</label>
                                    <Select 
                                        options={clients?.map(client => ({ value: client.id_client, label: client.nom_client }))}
                                        onChange={setSelectedClient}
                                    />
                                </div>
                                <div className="facture_controle">
                                    <label htmlFor="" className="facture_label">Quantité</label>
                                    <Input type="number" />
                                </div>
                                <div className="facture_controle">
                                    <label htmlFor="" className="facture_label">Remises</label>
                                    <Select 
                                        options={clients?.map(client => ({ value: client.id, label: client.nom }))}
                                        onChange={setSelectedClient}
                                    />
                                </div>
                                <div className="facture_controle">
                                    <label htmlFor="" className="facture_label">Taxes</label>
                                    <Select 
                                        options={clients?.map(client => ({ value: client.id, label: client.nom }))}
                                        onChange={setSelectedClient}
                                    />
                                </div>
                                <div className="facture_btn">
                                    <button>Créer la facture</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

       </>
    );
}

export default FactureForm;
