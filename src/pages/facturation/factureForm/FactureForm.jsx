import React, { useState, useEffect, useCallback } from 'react';
import './factureForm.scss';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { Input, Modal, Button } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FactureForm() {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState({
        quantite: null, // Initialize with null or ''
    });
    const [clients, setClients] = useState([]);
    const [idClients, setIdClients] = useState([]);
    const [nbre, setNbres] = useState('');
    const [remises, setRemises] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // Fetch initial data
        axios.get(`${DOMAIN}/client`)
            .then(clientsRes => {
                setClients(clientsRes.data);
            })
            .catch(error => {
                console.error('Error fetching clients:', error);
            });

        axios.get(`${DOMAIN}/facture/remises`)
            .then(remisesRes => {
                setRemises(remisesRes.data);
            })
            .catch(error => {
                console.error('Error fetching remises:', error);
            });

        axios.get(`${DOMAIN}/facture/taxes`)
            .then(taxesRes => {
                setTaxes(taxesRes.data);
            })
            .catch(error => {
                console.error('Error fetching taxes:', error);
            });

        if (idClients) {
            axios.get(`${DOMAIN}/traceur/countClient?id_client=${idClients}`)
                .then(traceurRes => {
                    setNbres(traceurRes.data[0].nbre_traceur);
                    if (!data.quantite) {
                        setData(prev => ({ ...prev, quantite: nbre }));
                    }
                })
                .catch(error => {
                    console.error('Error fetching traceur count:', error);
                });
        }
    }, [DOMAIN, idClients, data.quantite, nbre]);

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
        if (actionMeta.name === "id_client") {
            setIdClients(selectedOption.value);
        }
    };

    const handleModalOk = () => {
        setModalVisible(false);
        toast.success('Facture créée avec succès !');
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const createFacture = (e) => {
        e.preventDefault();
        const date_facture = new Date().toISOString().split('T')[0];
        const details = [{
            quantite: data.quantite,
            prix_unitaire: data.prix_unitaire,
            id_remise: data.id_remise || null,
            id_taxe: data.id_taxe || null
        }];
        axios.post(`${DOMAIN}/facture`, { id_client: data.id_client, date_facture, details })
            .then(response => {
                console.log('Facture créée:', response.data);
                setModalVisible(true);
            })
            .catch(error => {
                console.error('Erreur lors de la création de la facture:', error);
                toast.error('Erreur lors de la création de la facture.');
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
                            <form className='factureForm' onSubmit={createFacture}>
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
                                    <Input type="number" name='quantite' min={0} placeholder='10' value={data.quantite || ''} onChange={handleInputChange} />
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
                                        name='id_taxe'
                                    />
                                </div>
                                <div className="facture_btn">
                                    <button type="submit">Créer la facture</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Confirmation"
                visible={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <p>Êtes-vous sûr de vouloir créer cette facture ?</p>
            </Modal>
            <ToastContainer />
        </>
    );
}

export default FactureForm;
