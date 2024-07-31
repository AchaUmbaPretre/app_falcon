import React, { useState, useEffect } from 'react';
import config from '../../../config';
import useQuery from '../../../useQuery';
import { BarcodeOutlined, ThunderboltOutlined, CalendarOutlined } from '@ant-design/icons';
import './factureEffectue.scss';
import { Button, Select, Table, Tag } from 'antd';
import moment from 'moment';
import axios from 'axios';

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
    const [montantFilter, setMontantFilter] = useState('');

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
        const filteredActif = data.actif.filter(item => selectedIds.includes(item.id_operations));
        const filteredAutres = data.autres.filter(item => selectedIds.includes(item.id_operations));

        setDataAll([
            ...filteredActif,
            ...filteredAutres
        ]);
    }, [selectedRowKeys, data]);

    useEffect(() => {
        const fetchTarif = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/facture/tarif`);
                setTarif(data);
            
                if (data.length > 0) {
                    setMontantFilter(data[1].prix); 
                    setMontant(data[1].prix);
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
            sorter: (a, b) => moment(a.date_operation) - moment(b.date_operation),
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-yyyy')}
              </Tag>
            ),
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

    const handleTarifChange = (value) => {
        setMontantFilter(value);
        setMontant(value);
    };

    const monthsDifference = moment(dateEnd).diff(moment(dateStart), 'months');

    return (
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
                    <div className="factureEffectue_rows">
                        <span className="facture_desc">Sélectionnez le tarif <span>*</span></span>
                        <Select value={montantFilter} onChange={handleTarifChange} style={{ width: 200 }}>
                            {tarif.map((item) => (
                                <Option key={item.id} value={item.prix}>{item.type}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Montant à payer pour {dataAll.length} vehicule(s) : <span>*</span></span>
                        <span> {montant * dataAll.length} $</span>
                    </div>
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Montant total pour {monthsDifference} mois  <span>*</span> :</span>
                        <span> {montant * dataAll.length * monthsDifference} $</span>
                    </div>
                    <Button type="primary">Envoyer</Button>
                </div>
            </div>
        </div>
    );
};

export default FactureEffectue;
