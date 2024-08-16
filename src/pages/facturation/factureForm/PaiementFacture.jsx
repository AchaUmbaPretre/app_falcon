import React, { useState, useCallback } from 'react';
import './factureForm.scss';
import axios from 'axios';
import config from '../../../config';
import { Input, Modal, Button, DatePicker } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const PaiementFacture = ({ idFacture }) => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        const updatedValue = (name === "email") ? value.toLowerCase() : value.charAt(0).toUpperCase() + value.slice(1);

        setData((prevData) => ({ ...prevData, [name]: updatedValue }));
    }, []);

    const handleDateChange = (date, dateString) => {
        setData((prevData) => ({ ...prevData, date_paiement: dateString }));
    };

    const handleModalOk = () => {
        setModalVisible(false);
        toast.success('Facture créée avec succès !');
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const createFacture = async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // Eviter les doublons

        setIsSubmitting(true);
        try {
            const response = await axios.post(`${DOMAIN}/facture/paiement`, { ...data, id_facture: idFacture });
            console.log('Paiement créé:', response.data);
            toast.success('Véhicules créés avec succès!');
            navigate('/vehicules');
            setModalVisible(true);
        } catch (error) {
            console.error('Erreur lors de la création de la facture:', error);
            toast.error('Erreur lors de la création de la facture.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="factureForm">
                <div className="factureForm_container">
                    <div className="factureForm_top">
                        <h2 className="facture_h2">Créer un nouveau paiement</h2>
                    </div>
                    <div className="factureForm_wrapper">
                        <form className='factureForm' onSubmit={createFacture}>
                            <div className="facture_controle">
                                <label className="facture_label">
                                    Montant <span style={{ color: 'red' }}>*</span>
                                </label>
                                <Input type="number" name='montant' placeholder='1000' min={0} onChange={handleInputChange} />
                            </div>
                            <div className="facture_controle" style={{ display: "flex", flexDirection: 'column' }}>
                                <label className="facture_label">
                                    Date de paiement <span style={{ color: 'red' }}>*</span>
                                </label>
                                <DatePicker name='date_paiement' onChange={handleDateChange} />
                            </div>
                            <div className="facture_btn">
                                <button type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Création en cours...' : 'Créer le paiement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Modal
                title="Confirmation"
                visible={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <p className="modal-text">Êtes-vous sûr de vouloir effectuer cette action ?</p>
                <div className="modal-data">
                    <p><strong>Montant:</strong> {data.montant}</p>
                    <p><strong>Date de paiement:</strong> {data.date_paiement}</p>
                </div>
            </Modal>
            <ToastContainer />
        </>
    );
};

export default PaiementFacture;
