import React, { useEffect, useState } from 'react';
import config from '../../../config';
import axios from 'axios';
import {
    CalendarOutlined, CarOutlined, DollarOutlined
  } from '@ant-design/icons';
import { Table, Spin, Tag } from 'antd';
import styles from './detailFacture.scss';
import moment from 'moment';

const DetailFacture = ({ id_facture }) => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/facture/One?id_facture=${id_facture}`);
            setData(data);
            setLoading(false);
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        };
        fetchData();
      }, [DOMAIN, id_facture]);

    const columns = [
        { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
        {
            title: 'Nom Client',
            dataIndex: 'nom_client',
            key: 'nom_client',
            render: (text) => (
                <Tag color="blue">
                  {text}
                </Tag>
            )
        },
        {
            title: 'Nom Véhicule',
            dataIndex: 'nom_vehicule',
            key: 'nom_vehicule',
            render: (text) => (
                <Tag color= { text ? 'blue' : 'red'}>
                  <CarOutlined style={{ marginRight: "5px" }} />
                  {text || 'Aucun'}
                </Tag>
              )
        },
        {
            title: 'Date Facture',
            dataIndex: 'date_facture',
            key: 'date_facture',
            sorter: (a, b) => moment(a.date_facture) - moment(b.date_facture),
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
                <Tag icon={<CalendarOutlined />} color="blue">
                  {moment(text).format('DD-MM-yyyy')}
                </Tag>
            )
        },
        {
            title: 'Montant',
            dataIndex: 'montant',
            key: 'montant',
            sorter: (a, b) => (a.montant) - moment(b.montant),
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
                <div>
                    <Tag color={text > 0 ? 'green' : 'red'}>{text}<DollarOutlined style={{ marginLeft: "5px" }} /></Tag>
                </div>
            )
        }
    ];

    if (loading) {
        return <div className={styles.detail_facture}><Spin tip="Loading..." /></div>;
    }

    return (
        <div className={styles.detail_facture}>
            <div className={styles.detail_facture_wrapper}>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => record.date_facture + record.nom_vehicule} 
                    pagination={{ pageSize: 10 }} 
                />
            </div>
        </div>
    );
};

export default DetailFacture;
