import React, { useState, useEffect } from 'react';
import config from '../../../config';
import useQuery from '../../../useQuery';
import { BarcodeOutlined, ThunderboltOutlined } from '@ant-design/icons';
import './factureEffectue.scss';
import { Table, Tag } from 'antd';
import moment from 'moment';
import axios from 'axios';

const FactureEffectue = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const query = useQuery();
    const dateStart = query.get('start_date');
    const dateEnd = query.get('end_date');
    const idClient = query.get('id_client');
    const [data, setData] = useState({ actif: [], autres: [] });
    const [selectedRowKeys, setSelectedRowKeys] = useState({
        actif: [],  // Initialement vide
        autres: []  // Initialement vide
    });
    
    const [loading, setLoading] = useState(true);
    const [dataAll, setDataAll] = useState([]);
    const scroll = { x: 'max-content' };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${DOMAIN}/facture/factureOperation`, {
                    params: { start_date: dateStart, end_date: dateEnd, id_client: idClient }
                });
                setData(response.data);
                const actifKeys = response.data.actif.map(item => item.id_operations);
                setSelectedRowKeys({
                    actif: actifKeys,  // Définir les clés sélectionnées pour 'actif'
                    autres: []        // Assurez-vous que 'autres' est vide par défaut
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
        setDataAll([
            ...selectedRowKeys.actif,
            ...selectedRowKeys.autres
        ]);
    }, [selectedRowKeys, data]);
    
    
    

    console.log(dataAll);

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
            title: 'Vehicule',
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
    ];

    const columnsWithOperation = [
        ...columnsCommon,
        {
            title: "Opération",
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

    const monthsDifference = moment(dateEnd).diff(moment(dateStart), 'months');

    return (
        <>
            <div className="factureEffectue">
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
                                scroll={scroll}
                            />
                            <h3>Autres</h3>
                            <Table
                                dataSource={data.autres}
                                columns={columnsWithOperation}
                                rowSelection={rowSelectionAutres}
                                loading={loading}
                                rowKey="id_operations"
                                className='table_client'
                                scroll={scroll}
                            />
                        </div>
                    </div>
                    <div className="factureEffectue_right">
                        Right
                    </div>
                </div>
            </div>
        </>
    );
}

export default FactureEffectue;
