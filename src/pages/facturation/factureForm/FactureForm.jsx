import React, { useState, useEffect, useCallback } from 'react';
import './factureForm.scss';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { Input } from 'antd';

function FactureForm() {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState({});
    const [clients, setClients] = useState([]);
    const [remises, setRemises] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [factureDetails, setFactureDetails] = useState([]);

    useEffect(() => {
        axios.get(`${DOMAIN}/client`).then(response => setClients(response.data));
        axios.get(`${DOMAIN}/facture/remises`).then(response => setRemises(response.data));
        axios.get(`${DOMAIN}/facture/taxes`).then(response => setTaxes(response.data));
    }, [DOMAIN]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name === "email") {
            updatedValue = value.toLowerCase();
        } else if (Number.isNaN(Number(value))) {
            updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
        }

        setData((prev) => ({ ...prev, [name]: updatedValue }));
    }, []);

    const handleSelectChange = (selectedOption, actionMeta) => {
        setData((prev) => ({ ...prev, [actionMeta.name]: selectedOption.value }));
    };

    const createFacture = () => {
        const date_facture = new Date().toISOString().split('T')[0];
        const details = data.map(detail => ({
            quantite: detail.quantite,
            prix_unitaire: detail.prix,
            id_remise: detail.id_remise ? detail.id_remise.value : null,
            id_taxe: detail.id_taxe ? detail.id_taxe.value : null
        }));
        axios.post(`${DOMAIN}/factures`, { id_client: data.id_client ,date_facture, details })
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
                                    <label htmlFor="" className="facture_label">Client <span style={{ color: 'red' }}>*</span></label>
                                    <Select
                                        options={clients.map(client => ({ value: client.id_client, label: client.nom_client }))}
                                        onChange={handleSelectChange}
                                        name='id_client'
                                    />
                                </div>
                                <div className="facture_controle">
                                    <label htmlFor="" className="facture_label">Quantité <span style={{ color: 'red' }}>*</span></label>
                                    <Input type="number" name='quantite' min={0} placeholder='10' onChange={handleInputChange} />
                                </div>
                                <div className="facture_controle">
                                    <label htmlFor="" className="facture_label">Prix <span style={{ color: 'red' }}>*</span></label>
                                    <Input type="number" name='prix_unitaire' placeholder='1000' min={0} onChange={handleInputChange} />
                                </div>
                                <div className="facture_controle">
                                    <label htmlFor="" className="facture_label">Remises <span style={{ color: 'red' }}>*</span></label>
                                    <Select
                                        options={remises.map(r => ({ value: r.id_remise, label: r.description }))}
                                        onChange={handleSelectChange}
                                        name='id_remise'
                                    />
                                </div>
                                <div className="facture_controle">
                                    <label htmlFor="" className="facture_label">Taxes <span style={{ color: 'red' }}>*</span></label>
                                    <Select
                                        options={taxes.map(t => ({ value: t.id_taxes, label: t.description }))}
                                        onChange={handleSelectChange}
                                        name='id_taxes'
                                    />
                                </div>
                                <div className="facture_btn">
                                    <button onClick={createFacture}>Créer la facture</button>
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
