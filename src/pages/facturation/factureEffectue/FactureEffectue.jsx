import React, { useState, useEffect } from 'react';
import config from '../../../config';
import useQuery from '../../../useQuery';
import { CalendarOutlined, BarcodeOutlined } from '@ant-design/icons';
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
    const [data, setData] = useState({ etat_7: [], autres: [] }); // Initialize state with an object containing two arrays
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const scroll = { x: 400 };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${DOMAIN}/facture/factureOperation`, {
                    params: { start_date: dateStart, end_date: dateEnd, id_client: idClient }
                });
                setData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [DOMAIN, dateStart, dateEnd, idClient]);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns = [
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
        {
            title: "Date d'opération",
            dataIndex: 'date_operation',
            key: 'date_operation',
            sorter: (a, b) => moment(a.date_operation) - moment(b.date_operation),
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
                <Tag icon={<CalendarOutlined />} color="blue">
                    {moment(text).format('DD-MM-YYYY')}
                </Tag>
            ),
        }
    ];

    return (
        <>
            <div className="factureEffectue">
                <div className="factureEffectue_wrapper">
                    <div className="factureEffectue_left">
                        <h2 className="facture_h2">Liste des véhicules</h2>
                        <div className="facture_tab">
                            <h3>Etat 7</h3>
                            <Table
                                dataSource={data.etat_7}
                                columns={columns}
                                rowSelection={rowSelection}
                                loading={loading}
                                rowKey="id_operations"
                                className='table_client'
                                scroll={scroll}
                            />
                            <h3>Autres</h3>
                            <Table
                                dataSource={data.autres}
                                columns={columns}
                                rowSelection={rowSelection}
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
