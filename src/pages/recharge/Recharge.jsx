import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Popconfirm, Popover, Space, Table, Tag, Input, message } from 'antd';
import { 
  PlusCircleOutlined, 
  SisternodeOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  PhoneOutlined, 
  BarcodeOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  FilePdfOutlined, 
  FileExcelOutlined, 
  PrinterOutlined,
  CarOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import config from '../../config';

const Recharge = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/recharge`);
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/recharge/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // Function to group data by id_client
  const groupByClient = (data) => {
    return data.reduce((result, item) => {
      const { id_client } = item;
      if (!result[id_client]) {
        result[id_client] = [];
      }
      result[id_client].push(item);
      return result;
    }, {});
  };

  const groupedData = Object.entries(groupByClient(data)).map(([id_client, records]) => ({
    id_client,
    key: id_client,
    ...records[0],
    records,
  }))

  const columns = [
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
    },
    {
        title: 'Numero',
        dataIndex: 'numero',
        key: 'numero',
        render: (text) => (
          <Tag color='blue' onClick={() => handleCopy(text)}>
            <PhoneOutlined style={{ marginRight: 5 }} />
            {text}
          </Tag>
        ),
      },
      {
        title: 'Traceur',
        dataIndex: 'numero_serie',
        key: 'numero_serie',
        render: (text) => (
          <Tag color='blue'>
            <BarcodeOutlined style={{ marginRight: 5 }} />
            {text}
          </Tag>
        ),
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
        ),
      },
      {
        title: 'Status',
        dataIndex: 'recharge_status',
        key: 'recharge_status',
        render: (text) => (
          <Tag color={text === "Rechargez aujourd'hui" ? 'red' : 'blue'}>
            {text}
          </Tag>
        ),
      },
      {
        title: 'Nbre de jour',
        dataIndex: 'days',
        key: 'days',
        render: (text) => (
          <Tag color='blue'>
            {text}
          </Tag>
        ),
      },
      {
        title: 'Nbre restant',
        dataIndex: 'days_restant',
        key: 'days_restant',
        render: (text) => (
          <Tag color={text === 0 ? 'red' : 'green'}>
            {text}
          </Tag>
        ),
      },
      {
        title: 'Date de recharge',
        dataIndex: 'date_recharge',
        key: 'date_recharge',
        sorter: (a, b) => moment(a.date_recharge) - moment(b.date_recharge),
        sortDirections: ['descend', 'ascend'],
        render: (text) => (
          <Tag icon={<CalendarOutlined />} color='blue'>
            {moment(text).format('DD-MM-yyyy')}
          </Tag>
        ),
      }
  ];

  const expandedRowRender = (record) => {
    const columns = [
      { 
        title: '#', 
        dataIndex: 'id', 
        key: 'index', 
        render: (text, record, index) => index + 1, 
        width: "3%" 
      },
      {
        title: 'Client',
        dataIndex: 'nom_client',
        key: 'nom_client',
        render: (text) => (
          <Tag color='blue'>
            <UserOutlined style={{ marginRight: 5 }} />
            {text}
          </Tag>
        ),
      },
      {
        title: 'Numero',
        dataIndex: 'numero',
        key: 'numero',
        render: (text) => (
          <Tag color='blue' onClick={() => handleCopy(text)}>
            <PhoneOutlined style={{ marginRight: 5 }} />
            {text}
          </Tag>
        ),
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
        ),
      },
      {
        title: 'Marque',
        dataIndex: 'nom_marque',
        key: '',
        render: (text) => (
          <Tag color='blue'>
            <CarOutlined style={{ marginRight: "5px" }} />
            {text}
          </Tag>
        ),
      },
      {
        title: 'Traceur',
        dataIndex: 'numero_serie',
        key: 'numero_serie',
        render: (text) => (
          <Tag color='cyan'>
            <BarcodeOutlined style={{ marginRight: 5 }} />
            {text}
          </Tag>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'recharge_status',
        key: 'recharge_status',
        render: (text) => (
          <Tag color={text === "Rechargez aujourd'hui" ? 'red' : 'blue'}>
            {text}
          </Tag>
        ),
      },
      {
        title: 'Nbre jour',
        dataIndex: 'days',
        key: 'days',
        render: (text) => (
          <Tag color='blue'>
            {text}
          </Tag>
        ),
      },
      {
        title: 'Nbre restant',
        dataIndex: 'days_restant',
        key: 'days_restant',
        render: (text) => (
          <Tag color={text === 0 ? 'red' : 'green'}>
            {text}
          </Tag>
        ),
      },
      {
        title: 'Date de recharge',
        dataIndex: 'date_recharge',
        key: 'date_recharge',
        sorter: (a, b) => moment(a.date_recharge) - moment(b.date_recharge),
        sortDirections: ['descend', 'ascend'],
        render: (text) => (
          <Tag icon={<CalendarOutlined />} color='blue'>
            {moment(text).format('DD-MM-yyyy')}
          </Tag>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: "160px",
        render: (text, record) => (
          <Space size="middle">
            <Popover title="Supprimer" trigger="hover">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer?"
                onConfirm={() => handleDelete(record.id_recharge)}
                okText="Oui"
                cancelText="Non"
              >
                <Button icon={<DeleteOutlined />} style={{ color: 'red' }} />
              </Popconfirm>
            </Popover>
          </Space>
        ),
      },
    ];

    return <Table columns={columns} dataSource={record.records} pagination={false} rowKey="id_recharge" />;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Numéro copié dans le presse-papiers');
    }).catch((err) => {
      message.error('Échec de la copie');
      console.error('Could not copy text: ', err);
    });
  };

  const filteredData = groupedData.filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.numero?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Recharge</h2>
              <span className="client_span">Liste des recharges</span>
            </div>
            <div className="client_text_right">
              <Button onClick={() => setOpen(true)} icon={<PlusCircleOutlined />} />
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb
            separator=">"
            items={[
              { title: 'Accueil' },
              { title: 'Application Center', href: '/' },
            ]}
          />
          <div className="client_wrapper_center_bottom">
            <div className="product-bottom-top">
              <div className="product-bottom-left">
                <SisternodeOutlined className='product-icon' />
                <div className="product-row-search">
                  <SearchOutlined className='product-icon-plus' />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder='Recherche...'
                    className='product-search'
                  />
                </div>
              </div>
              <div className="product-bottom-right">
                <FilePdfOutlined className='product-icon-pdf' />
                <FileExcelOutlined className='product-icon-excel' />
                <PrinterOutlined className='product-icon-printer' />
              </div>
            </div>
            <Table
              columns={columns}
              expandable={{ expandedRowRender }}
              dataSource={filteredData}
              loading={loading}
              rowKey="id_client"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recharge;
