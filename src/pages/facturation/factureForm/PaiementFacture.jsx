import React, { useState, useCallback, useEffect } from 'react';
import './factureForm.scss';
import axios from 'axios';
import config from '../../../config';
import { Input, Modal, Button, DatePicker, Spin, Tabs, Select } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { TabPane } = Tabs;

const PaiementFacture = ({ idFacture }) => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState({});
    const [montantFacture, setMontantFacture] = useState('');
    const [dataClient, setDataClient] = useState([]);
    const [methode, setMethode] = useState([]);
    const [activeTab, setActiveTab] = useState("1");
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const userId = useSelector((state) => state.user.currentUser.id);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientResponse = await axios.get(`${DOMAIN}/client`);
                setDataClient(clientResponse.data);

                const methodeResponse = await axios.get(`${DOMAIN}/paiement/methode`);
                setMethode(methodeResponse.data);

                const factureResponse = await axios.get(`${DOMAIN}/facture/OneMontant?id_facture=${idFacture}`);
                const montant = factureResponse.data[0]?.total;
                setMontantFacture(montant);
                setData((prevData) => ({ ...prevData, montant: montant }));
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [DOMAIN, idFacture]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        const updatedValue = (name === "email") ? value.toLowerCase() : value.charAt(0).toUpperCase() + value.slice(1);

        setData((prevData) => ({ ...prevData, [name]: updatedValue }));
    }, []);

    const handleDateChange = (date, dateString) => {
        setData((prevData) => ({ ...prevData, date_paiement: dateString }));
    };

    const handleModalOk = async () => {
        setModalVisible(false);
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${DOMAIN}/paiement/paiementOk`, { ...data, id_facture: idFacture,user_paiement: userId });
            console.log('Paiement créé:', response.data);
            toast.success('Paiement créé avec succès!');
            navigate('/paiement');
        } catch (error) {
            console.error('Erreur lors de la création de la facture:', error);
            toast.error('Erreur lors de la création de la facture.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const showModal = (e) => {
        e.preventDefault();
        setModalVisible(true);
    };

    return (
        <>
            <div className="paiementForm">
            <ToastContainer />
                <div className="product-container">
                    <div className="product-container-top">
                        <h2 className="product-h2">Paiement</h2>
                    </div>
                    <div className="product-wrapper">
                        <Tabs activeKey={activeTab} onChange={setActiveTab}>
                            <TabPane tab="Informations Client" key="1">
                                <form className="product-container-bottom form_hand" onSubmit={showModal}>
                                    <div className="form-controle">
                                        <label htmlFor="id_client">
                                            Client <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <Select
                                            name="id_client"
                                            options={dataClient.map((item) => ({
                                                value: item.id_client,
                                                label: item.nom_client,
                                            }))}
                                            onChange={(selectedOption) => setData((prev) => ({ ...prev, id_client: selectedOption }))}
                                            placeholder="Sélectionnez un client..."
                                        />
                                    </div>

                                    <div className="form-controle">
                                        <label htmlFor="montant">
                                            Montant <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            name="montant"
                                            className="form-input"
                                            value={data.montant || montantFacture} // Valeur par défaut ou valeur modifiée
                                            onChange={handleInputChange}
                                            required
                                            placeholder="ex : 100"
                                        />
                                    </div>

                                    <div className="form-controle">
                                        <label htmlFor="methode">
                                            Méthode de paiement <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <Select
                                            name="methode"
                                            options={methode.map((item) => ({
                                                value: item.id_methode,
                                                label: item.nom_methode,
                                            }))}
                                            onChange={(selectedOption) => setData((prev) => ({ ...prev, methode: selectedOption }))}
                                            placeholder="Sélectionnez une méthode..."
                                        />
                                    </div>
                                    <div className="form-controle" style={{ display: "flex", flexDirection: 'column' }}>
                                        <label>
                                            Date de paiement <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <DatePicker name='date_paiement' onChange={handleDateChange} />
                                    </div>
                                </form>
                            </TabPane>

                            <TabPane tab="Détails du Paiement" key="2">
                                <form className="product-container-bottom form_hand" onSubmit={showModal}>
                                    <div className="form-controle">
                                        <label htmlFor="numero_paiement">
                                            Numéro de paiement <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            name="code_paiement"
                                            className="form-input"
                                            placeholder="ex : 123456"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-controle">
                                        <label htmlFor="document">
                                            Document <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="document"
                                            className="form-input"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-controle">
                                        <label htmlFor="reference">
                                            Référence <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ref"
                                            className="form-input"
                                            onChange={handleInputChange}
                                            placeholder="Référence"
                                        />
                                    </div>
                                    <div className="form-submit">
                                        <button type="submit" className="btn-submit" disabled={isSubmitting || isLoading}>
                                            {isSubmitting ? 'En cours...' : 'Envoyer'}
                                        </button>
                                        {isLoading && (
                                            <div className="loader-container loader-container-center">
                                                <Spin size="large" />
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </TabPane>
                        </Tabs>
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
        </>
    );
};

export default PaiementFacture;
