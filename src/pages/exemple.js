import React, { useState, useEffect, useCallback } from 'react';
import config from '../../../config';
import useQuery from '../../../useQuery';
import { getColorForOperationType } from '../../../utils';
import { BarcodeOutlined, ThunderboltOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import './factureEffectue.scss';
import { Button, DatePicker, Input, Modal, Select, Spin, Table, Tag } from 'antd';
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
    
    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
    };

    const handleConfirmModal = () => {
        onFinish();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${DOMAIN}/facture/factureOperation`, {
                    params: { start_date: dateStart, end_date: dateEnd, id_client: idClient }
                });
                setData(response.data);
                const actifKeys = response.data.actif.map(item => item.id_vehicule);
                console.log(actifKeys)
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

    const calculateDaysActive = (operationDate) => {
        const opDate = moment(operationDate);
        const start = moment(dateStart);
        const end = moment(dateEnd);
        
        if (opDate.isBefore(start)) opDate.set('date', start.date());
        if (opDate.isAfter(end)) opDate.set('date', end.date());

        const daysActive = opDate.isSameOrAfter(start) && opDate.isSameOrBefore(end)
            ? opDate.diff(start, 'days') + 1
            : 0;

        return daysActive;
    };

    const calculateAmountForVehicle = (price, startDate, endDate) => {
        // Exemple de logique pour calculer le montant
        const days = moment(endDate).diff(moment(startDate), 'days') + 1;
        return price * days; // Assurez-vous que le montant est calculé correctement
    };
    
    useEffect(()=>{
        const calculateTotalAmountUse = () => {
            const selectedVehicules = vehicule.filter(v => 
                selectedRowKeys.actif.includes(v.id_vehicule) || selectedRowKeys.autres.includes(v.id_vehicule)
            );
            
            const totalAmount = selectedVehicules.reduce((acc, curr) => acc + calculateAmountForVehicle(curr), 0);
            setTotalVehicule(totalAmount);
            return totalAmount - remise;
        };

        calculateTotalAmountUse();
    }, [vehicule, selectedRowKeys, remise, dateStart, dateEnd]);

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
            render: (text) => (
                <Tag color='blue'>
                    <CalendarOutlined style={{ marginRight: '5px' }} />
                    {moment(text).format('DD/MM/YYYY')}
                </Tag>
            ),
        },
    ];

    const columnsWithOperation = [
        ...columnsCommon,
        {
            title: 'Montant',
            key: 'montant',
            render: (text, record) => {
                const amount = calculateAmountForVehicle(record);
                return (
                    <Tag color={amount > 0 ? 'green' : 'red'}>
                        {amount.toFixed(2)} <DollarOutlined style={{ marginLeft: "5px" }} />
                    </Tag>
                );
            },
        },
    ];

    return (
        <>
            <Table
                rowKey='id_vehicule'
                dataSource={data.actif}
                columns={columnsWithOperation}
                rowSelection={rowSelectionActif}
                pagination={false}
                loading={loading}
            />
            <Table
                rowKey='id_vehicule'
                dataSource={data.autres}
                columns={columnsWithOperation}
                rowSelection={rowSelectionAutres}
                pagination={false}
                loading={loading}
            />
            <div>
                <span>Total Montant : </span>
                <Tag color='geekblue'>{totalMontant.toFixed(2)} <DollarOutlined style={{ marginLeft: "5px" }} /></Tag>
            </div>
            <Button onClick={handleOpenModal}>Finaliser</Button>
            <Modal
                title="Confirmer"
                visible={isModalVisible}
                onOk={handleConfirmModal}
                onCancel={handleCancelModal}
                confirmLoading={isSubmitting}
            >
                <p>Voulez-vous confirmer la facture?</p>
            </Modal>
            <ToastContainer />
        </>
    );
};

export default FactureEff;
