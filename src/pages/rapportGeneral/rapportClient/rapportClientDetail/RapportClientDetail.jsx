import React, { useEffect, useState } from 'react';
import { Skeleton, Table, Tag } from 'antd';
import { CarOutlined, UserOutlined,BarcodeOutlined,CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import config from '../../../../config';
import axios from 'axios';
import moment from 'moment';

const RapportClientDetail = ({ id_client }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const [dataVehicule, setDataVehicule] = useState([]);
  const [dataFacture, setDataFacture] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/client/client_gen?id_client=${id_client}`);
        setData(data[0]);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN, id_client]);

  useEffect(() => {
    const fetchDataVehicule = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/vehicule?id_client=${id_client}`);
        setDataVehicule(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataVehicule();
  }, [DOMAIN, id_client]);


  useEffect(() => {
    const fetchDataFacture = async (page, pageSize) => {
        try {
          const { data, headers } = await axios.get(`${DOMAIN}/facture`, {
            params: {
              page,
              pageSize,
              id_client
            },
          });
          setDataFacture(data);
        } catch (error) {
          console.log(error);
        }
      };
    fetchDataFacture();
  }, [DOMAIN, id_client]);


  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Nom vehicule',
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
      title: 'Marque',
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      render: (text) => (
        <Tag color='blue'>
          <CarOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Modéle',
      dataIndex: 'modele',
      key: 'modele',
      render: (text) => (
        <Tag color={text ? 'blue' : 'red'}>
          <CarOutlined style={{ marginRight: "5px" }} />
          {text || 'Aucun'}
        </Tag>
      )
    },
    {
      title: 'Matricule',
      dataIndex: 'matricule',
      key: 'matricule',
      render: (text) => (
        <Tag color='blue'>
          <CarOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Tag(traceur)',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (
        <Tag color={text ? 'blue' : 'red'}>
          <BarcodeOutlined style={{ marginRight: '5px' }} />
          {text || 'Aucun'}
        </Tag>
      )
    }
  ].filter(Boolean);

  const columnsFacture = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Nom client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
      )
    },
    {
      title: 'Montant',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag color={text !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
          {text ? `${text} $` : '0'}
        </Tag>
      ),
    },
    {
      title: 'Date',
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
      title: 'Status',
      dataIndex: 'statut',
      key: 'statut',
      render: (text) => (
        <Tag color={
          text === 'non payé' ? 'red' :
          text === 'payé' ? 'green' :
          text === 'partiellement payé' ? 'blue' :
          'default'
        }>
          {text}
        </Tag>
      )
    }
  ];

  return (
    <div className="operationDetail">
      <Skeleton loading={loading} active>
        <div className="operationDetail_wrapper">
          <div className="operation_row">
            <span className="operation_span">Client :</span>
            <span className="operation_desc">{data?.nom_client}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Nbre véhicule :</span>
            <span className="operation_desc">{data?.nbre_facture}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Nbre de mois :</span>
            <span className="operation_desc">{data?.nbre_mois}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Nbre d'année :</span>
            <span className="operation_desc">{data?.nbre_annee}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Nbre de facture :</span>
            <span className="operation_desc">{data?.telephone}</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Facture total :</span>
            <span className="operation_desc">{data?.montant_total_facture} $</span>
          </div>
          <div className="operation_row">
            <span className="operation_span">Total payé :</span>
            <span className="operation_desc">{data?.montant_total_facture} $</span>
          </div>
        </div>
        </Skeleton>
        <div style={{width:'100%', overflowX:'scroll'}}>
            <h1 style={{ padding: '20px 0px', fontSize: "18px" }}>Liste des véhicules :</h1>
            <Table 
              dataSource={dataVehicule} 
              columns={columns} 
              rowClassName={() => 'font-size-18'} 
              loading={loading} 
              className='table_client' 
              pagination={{ pageSize: 15 }}
            />
        </div>

        <div style={{width:'100%', overflowX:'scroll'}}>
            <h1 style={{ padding: '20px 0px', fontSize: "18px" }}>Liste des factures :</h1>
            <Table 
              dataSource={dataFacture} 
              columns={columnsFacture} 
              rowClassName={() => 'font-size-18'} 
              loading={loading} 
              className='table_client' 
              pagination={{ pageSize: 15 }}
            />
        </div>
    </div>
  );
}

export default RapportClientDetail;
