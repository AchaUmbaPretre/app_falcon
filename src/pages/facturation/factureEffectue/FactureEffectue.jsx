import React, { useState, useEffect, useCallback } from 'react';
import config from '../../../config';
import useQuery from '../../../useQuery';
import { BarcodeOutlined, ThunderboltOutlined, CalendarOutlined } from '@ant-design/icons';
import './factureEffectue.scss';
import { Button, DatePicker, Input, message, Modal, Select, Table, Tag } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
const { Option } = Select;

const FactureEffectue = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const query = useQuery();
    const dateStart = query.get('start_date');
    const dateEnd = query.get('end_date');
    const idClient = query.get('id_client');
    const [data, setData] = useState({ actif: [], autres: [] });
    const [selectedRowKeys, setSelectedRowKeys] = useState({ actif: [], autres: [] });
    const [montant, setMontant] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dataAll, setDataAll] = useState([]);
    const [tarif, setTarif] = useState([]);
    const [tarifClient, setTarifClient] = useState([]);
    const [montantFilter, setMontantFilter] = useState('');
    const [showTarifClient, setShowTarifClient] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [vehicule, setVehicule] = useState([]);
    const [date, setDate] = useState(null);
    const [remise, setRemise] = useState(0); 
    const monthsDifference = dateEnd && dateStart ? moment(dateEnd).diff(moment(dateStart), 'months') : 0;
    const totalMontantBeforeRemise = montant * dataAll.length * monthsDifference;
    const totalMontant = totalMontantBeforeRemise - remise;

/*     const handleModalOk = () => {
        setModalVisible(false);
        toast.success('Facture créée avec succès !');
    }; */

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${DOMAIN}/facture/factureOperation`, {
                    params: { start_date: dateStart, end_date: dateEnd, id_client: idClient }
                });
                setData(response.data);
                const actifKeys = response.data.actif.map(item => item.id_operations);
                setSelectedRowKeys({
                    actif: actifKeys,
                    autres: []
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [DOMAIN, dateStart, dateEnd, idClient]);

    useEffect(() => {
        const selectedIds = [
            ...selectedRowKeys.actif,
            ...selectedRowKeys.autres
        ];
        const filteredActif = data.actif
            .filter(item => selectedIds.includes(item.id_operations))
            .map(item => item.id_vehicule);
      
        const filteredAutres = data.autres
            .filter(item => selectedIds.includes(item.id_operations))
            .map(item => item.id_vehicule);
      
        setVehicule([
            ...filteredActif,
            ...filteredAutres
        ]);
        setDataAll(selectedIds);
    }, [selectedRowKeys, data]);

    useEffect(() => {
        const fetchClientTarif = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/facture/clientTarif`);
                setTarifClient(data);
            
                if (data.length > 0) {
                    setMontantFilter(data[0].prixClientTarif);
                    setMontant(data[0].prixClientTarif);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des tarifs:', error);
            }
        };
        fetchClientTarif();
    }, [DOMAIN]);

    useEffect(() => {
        const fetchTarif = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/facture/tarif`);
                setTarif(data);
            
                // Trouver la valeur par défaut pour le tarif
                const defaultTarif = data.find(item => item.type === 'Abonnement mensuel');
                if (defaultTarif) {
                    setMontantFilter(defaultTarif.prix);
                    setMontant(defaultTarif.prix);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des tarifs:', error);
            }
        };
        fetchTarif();
    }, [DOMAIN]);

    const getColorForOperationType = (type) => {
        switch (type) {
            case 'Installation':
                return 'blue';
            case 'Démantèlement':
                return 'red';
            case 'Contrôle technique':
                return 'green';
            case 'Remplacement':
                return 'orange';
            default:
                return 'default';
        }
    };

    const onSelectChange = (tableType, newSelectedRowKeys) => {
        setSelectedRowKeys(prev => ({
            ...prev,
            [tableType]: newSelectedRowKeys
        }));
    };

    const rowSelectionActif = {
        selectedRowKeys: selectedRowKeys.actif,
        onChange: (newSelectedRowKeys) => onSelectChange('actif', newSelectedRowKeys),
    };

    const rowSelectionAutres = {
        selectedRowKeys: selectedRowKeys.autres,
        onChange: (newSelectedRowKeys) => onSelectChange('autres', newSelectedRowKeys),
    };

    const columnsCommon = [
        { 
            title: '#', 
            dataIndex: 'id', 
            key: 'id', 
            render: (_, __, index) => index + 1, 
            width: "3%"
        },
        {
            title: 'Véhicule',
            dataIndex: 'nom_vehicule',
            key: 'nom_vehicule',
            render: (text) => (
                <Tag color='volcano'>
                    <BarcodeOutlined style={{ marginRight: '5px' }} />
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Traceur',
            dataIndex: 'code',
            key: 'code',
            render: (text) => (
                <Tag color='green'>
                    <BarcodeOutlined style={{ marginRight: '5px' }} />
                    {text}
                </Tag>
            )
        },
        {
            title: "Date d'opération",
            dataIndex: 'date_operation',
            key: 'date_operation',
            sorter: (a, b) => moment(a.date_operation).unix() - moment(b.date_operation).unix(),
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
                <Tag icon={<CalendarOutlined />} color="blue">
                    {moment(text).format('DD-MM-YYYY')}
                </Tag>
            ),
        },
    ];

    const columnsWithOperation = [
        ...columnsCommon,
        {
            title: "Type d'opération",
            dataIndex: 'type_operations',
            key: 'type_operations',
            render: (text) => (
                <Tag color={getColorForOperationType(text)}>
                    <ThunderboltOutlined style={{ marginRight: 5 }} />
                    {text}
                </Tag>
            ),
        }
    ];

    const handleTarifChange = (value) => {
        setMontantFilter(value);
        setMontant(value);
    };

    const handleRemiseChange = (e) => {
        setRemise(parseFloat(e.target.value) || 0);
    };

    const createFacture = useCallback(async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        if (!date) {
            toast.error('Veuillez remplir tous les champs requis');
            return;
          }

        setIsSubmitting(true);
        try {
            await axios.post(`${DOMAIN}/facture`, { id_client: idClient, total: totalMontant, date_facture: date, details: vehicule, montant: montant });
            message.success('Facture créee avec succès');
            setModalVisible(true);
        } catch (error) {
            console.error('Erreur lors de la création de la facture:', error);
            toast.error('Erreur lors de la création de la facture.');
        } finally {
            setIsSubmitting(false);
        }
    })

    return (
        <div className="factureEffectue">
            <ToastContainer />
            <div className="facture_title_date">
                <h1 className="facture_h1">
                    Du {moment(dateStart).format('DD-MM-YYYY')} au {moment(dateEnd).format('DD-MM-YYYY')} 
                     ({monthsDifference} mois)
                </h1>
            </div>
            <div className="factureEffectue_wrapper">
                <div className="factureEffectue_left">
                    <h2 className="facture_h2">Liste des véhicules</h2>
                    <div className="facture_tab">
                        <h3>Etat actif</h3>
                        <Table
                            dataSource={data.actif}
                            columns={columnsCommon}
                            rowSelection={rowSelectionActif}
                            loading={loading}
                            rowKey="id_operations"
                            className='table_client'
                            scroll={{ x: 'max-content' }}
                        />
                        <h3>Autres</h3>
                        <Table
                            dataSource={data.autres}
                            columns={columnsWithOperation}
                            rowSelection={rowSelectionAutres}
                            loading={loading}
                            rowKey="id_operations"
                            className='table_client'
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                </div>
                <div className="factureEffectue_right">
                    <h2 className="facture_h2">Détails de la facture</h2>
                    <div className="factureEffectue_rows">
                        <span className="facture_desc">Sélectionnez le tarif {showTarifClient && 'personnel'} <span>*</span></span>
                        {!showTarifClient && (
                            <Select value={montantFilter} onChange={handleTarifChange} style={{ width: 200 }}>
                                {tarif.map((item) => (
                                    <Option key={item.id_tarif} value={item.prix}>{`${item.type} : ${item.prix}$`}</Option>
                                ))}
                            </Select>
                        )}
                        {showTarifClient && (
                            <Select value={montantFilter} onChange={handleTarifChange} style={{ width: 200 }}>
                                {tarifClient.map((item) => (
                                    <Option key={item.id_clientTarif} value={item.prixClientTarif}>{`${item.typeClientTarif} : ${item.prixClientTarif}`}</Option>
                                ))}
                            </Select>
                        )}
                    </div>
                    <Button onClick={() => setShowTarifClient(prev => !prev)}> 
                        {showTarifClient ? 'Cacher le tarif personnel' : 'Afficher le tarif personnel'}
                    </Button>
                    
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Montant à payer pour {dataAll.length} véhicule(s) : <span>*</span></span>
                        <span>{montant * dataAll.length} $</span>
                    </div>
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Montant total pour {monthsDifference} mois  <span>*</span> :</span>
                        <span>{totalMontant} $</span>
                    </div>
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Remise : <span>*</span> :</span>
                        <Input
                            id="remise"
                            type="number"
                            min="0"
                            step="0.01"
                            value={remise}
                            onChange={handleRemiseChange}
                        />
                    </div>
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Date : <span>*</span></span>
                        <DatePicker 
                            value={date ? moment(date) : null} 
                            onChange={(date) => setDate(date ? date.format('YYYY-MM-DD') : '')}
                        />
                    </div>
                    <Button type="primary" onClick={createFacture} loading={isSubmitting}>Envoyer</Button>
                </div>
            </div>
            <Modal
                title="Confirmation"
                visible={modalVisible}handleModalOk
                onOk={createFacture}
                onCancel={handleModalCancel}
            >
                <p className="modal-text">Êtes-vous sûr de vouloir effectuer cette action ?</p>
                <div className="modal-data">
                    <p><strong>Montant:</strong> {montant * dataAll.length * monthsDifference} $</p>
                    <p><strong>Date de paiement:</strong> {moment().format('DD-MM-YYYY')}</p>
                </div>
            </Modal>
        </div>
    );
};

export default FactureEffectue;
