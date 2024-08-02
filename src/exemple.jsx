import React, { useState, useEffect, useCallback } from 'react';
import config from '../../../config';
import useQuery from '../../../useQuery';
import { getColorForOperationType } from '../../../utils';
import { BarcodeOutlined, ThunderboltOutlined, CalendarOutlined } from '@ant-design/icons';
import './factureEffectue.scss';
import { Button, DatePicker, Input, Select, Table, Tag, Modal } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
const { Option } = Select;

const FactureEff = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const query = useQuery();
    const dateStart = query.get('start_date');
    const dateEnd = query.get('end_date');
    const idClient = query.get('id_client');
    const [searchValue, setSearchValue] = useState('');
    const [date, setDate] = useState(null);
    const [data, setData] = useState({ actif: [], autres: [] });
    const [selectedRowKeys, setSelectedRowKeys] = useState({ actif: [], autres: [] });
    const [montant, setMontant] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dataAll, setDataAll] = useState([]);
    const [tarif, setTarif] = useState([]);
    const [tarifClient, setTarifClient] = useState([]);
    const [montantFilter, setMontantFilter] = useState('');
    const [showTarifClient, setShowTarifClient] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [vehicule, setVehicule] = useState([]);
    const [remise, setRemise] = useState(0);
    const [totalVehicule, setTotalVehicule] = useState('');
    const [commentaire, setCommentaire] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const monthsDifference = dateEnd && dateStart ? moment(dateEnd).diff(moment(dateStart), 'months') : 0;
    const totalMontantBeforeRemise = montant * dataAll.length * monthsDifference;
    const totalMontant = totalMontantBeforeRemise - remise;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${DOMAIN}/facture/factureOperation`, {
                    params: { start_date: dateStart, end_date: dateEnd, id_client: idClient }
                });
                setData(response.data);
                const actifKeys = response.data.actif.map(item => item.id_vehicule);
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

        const combinedData = [
            ...data.actif,
            ...data.autres
        ];
        
        const uniqueVehicules = Array.from(new Map(combinedData
            .filter(item => selectedIds.includes(item.id_vehicule))
            .map(item => [item.id_vehicule, item])) 
            .values()
        );

        const updatedVehicules = uniqueVehicules.map(item => ({
            id_vehicule: item.id_vehicule,
            prix: item.prix || montant
        }));
      
        setVehicule(updatedVehicules);
        setDataAll(selectedIds);
    }, [selectedRowKeys, data, montant]);

    useEffect(() => {
        const fetchClientTarif = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/facture/clientTarifOne?id_client=${idClient}`);
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
    }, [DOMAIN, idClient]);

    useEffect(() => {
        const fetchTarif = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/facture/tarif`);
                setTarif(data);
            
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

    const handleChange = (id, prix) => {
        setVehicule((prevSelectedRows) =>
          prevSelectedRows.map((row) =>
            row.id_vehicule === id ? { ...row, prix } : row
          )
        );
    };

    const calculateTotalAmount = () => {
        const selectedVehicules = vehicule.filter(v => 
            selectedRowKeys.actif.includes(v.id_vehicule) || selectedRowKeys.autres.includes(v.id_vehicule)
        );
        
        const totalAmount = selectedVehicules.reduce((acc, curr) => acc + (curr.prix * monthsDifference), 0);
        return totalAmount - remise;
    };

    useEffect(() => {
        const calculateTotalAmountUse = () => {
            const selectedVehicules = vehicule.filter(v => 
                selectedRowKeys.actif.includes(v.id_vehicule) || selectedRowKeys.autres.includes(v.id_vehicule)
            );
            
            const totalAmount = selectedVehicules.reduce((acc, curr) => acc + (curr.prix * monthsDifference), 0);
            setTotalVehicule(totalAmount)
            return totalAmount - remise;
        };

        calculateTotalAmountUse()
    }, [vehicule, selectedRowKeys, monthsDifference, remise]);

    const calculateTotalAmountVehicule = () => {
        const selectedVehicules = vehicule.filter(v => 
            selectedRowKeys.actif.includes(v.id_vehicule) || selectedRowKeys.autres.includes(v.id_vehicule)
        );
        
        const totalAmoutVehicule = selectedVehicules.reduce((acc, curr) => acc + curr.prix, 0);
        
        return totalAmoutVehicule;
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
                <Tag color='green'>
                    <BarcodeOutlined style={{ marginRight: '5px' }} />
                    {text}
                </Tag>
            ),
        },
        {
            title: "Date début",
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
        {
            title: "Date fin",
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
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={getColorForOperationType(type)}>
                    {type}
                </Tag>
            ),
        },
        {
            title: 'Montant',
            dataIndex: 'prix',
            key: 'prix',
            render: (text) => `${text} ${showTarifClient ? 'TTC' : 'HT'}`,
        },
        {
            title: 'Prix Total',
            key: 'total',
            render: (text, record) => `${record.prix} ${showTarifClient ? 'TTC' : 'HT'}`,
        },
    ];

    const columnsActif = [...columnsCommon];

    const columnsAutres = [...columnsCommon];

    const onFinish = async () => {
        setIsSubmitting(true);
        try {
            const dataToSubmit = {
                date,
                vehicule,
                montant,
                remise,
                totalVehicule,
                commentaire,
                showTarifClient,
            };

            await axios.post(`${DOMAIN}/facture`, dataToSubmit);
            toast.success('Facture créée avec succès');
        } catch (error) {
            console.error('Erreur lors de la soumission de la facture:', error);
            toast.error('Erreur lors de la création de la facture');
        } finally {
            setIsSubmitting(false);
            setIsModalVisible(false);
        }
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
    };

    const handleConfirmModal = () => {
        onFinish();
    };

    return (
        <div className="facture-eff">
            <ToastContainer />
            <div className="facture-header">
                <Button type="primary" onClick={handleOpenModal} loading={isSubmitting}>
                    Soumettre la Facture
                </Button>
            </div>
            <Table
                rowSelection={rowSelectionActif}
                columns={columnsActif}
                dataSource={data.actif}
                pagination={false}
                loading={loading}
                rowKey="id_vehicule"
            />
            <Table
                rowSelection={rowSelectionAutres}
                columns={columnsAutres}
                dataSource={data.autres}
                pagination={false}
                loading={loading}
                rowKey="id_vehicule"
            />
            <Modal
                title="Confirmation de Soumission"
                visible={isModalVisible}
                onOk={handleConfirmModal}
                onCancel={handleCancelModal}
                okText="Confirmer"
                cancelText="Annuler"
                confirmLoading={isSubmitting}
            >
                <p>Êtes-vous sûr de vouloir soumettre cette facture ?</p>
                <p><b>Date:</b> {date ? moment(date).format('DD-MM-YYYY') : 'Non définie'}</p>
                <p><b>Montant Total:</b> {totalVehicule} {showTarifClient ? 'TTC' : 'HT'}</p>
                <p><b>Commentaire:</b> {commentaire || 'Aucun'}</p>
            </Modal>
        </div>
    );
};

export default FactureEff;
