import React, { useCallback, useEffect, useState } from 'react';
import { Breadcrumb, Button, Popconfirm, Popover, Space, Table, Tag, Input, message, Modal, Skeleton } from 'antd';
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
  CarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  HourglassOutlined,
  CloseOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import config from '../../config';
import './recharge.scss';
import RechargeTrie from './rechargeTrie/RechargeTrie';
import Recharge_form from './form/Recharge_form';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
const scroll = { x: 400 };


const deleteRecharge = async (id) => {
  await axios.delete(`${DOMAIN}/recharge/${id}`);
};

const Recharge = () => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTrie, setOpenTrie] = useState(false);
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');


  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };


  const fetchRecharge = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${DOMAIN}/recharge`, {
        params: {
          start_date,
          end_date,
          searchValue,
        },
      });
      setData(data);
    } catch (error) {
      console.error('Failed to fetch operations:', error);
    } finally {
      setLoading(false);
    }
  }, [DOMAIN, start_date, end_date, searchValue]);

  useEffect(() => {
    fetchRecharge();
  }, [fetchRecharge]);

  const handleDelete = async (id) => {
    try {
      await deleteRecharge(id);
      setData((prevData) => prevData.filter(item => item.id_recharge !== id));
      message.success('Recharge deleted successfully');
    } catch (err) {
      console.error('Error deleting recharge:', err);
      message.error('Failed to delete recharge');
    }
  };

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
    numberCount: records.length, // Adding the count of numbers recharged
  }));

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Numéro copié dans le presse-papiers');
    }).catch((err) => {
      message.error('Échec de la copie');
      console.error('Could not copy text: ', err);
    });
  };

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
      title: 'Nbre rechargé',
      dataIndex: 'numberCount',
      key: 'numberCount',
      render: (count) => (
        <Tag color='green'>
          <HourglassOutlined style={{ marginRight: 5 }} />
          {count}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'recharge_status',
      key: 'recharge_status',
      render: (status) => {
        let color = 'blue';
        let icon = <CheckCircleOutlined />;
        if (status === "Inactif") {
          color = 'red';
          icon = <StopOutlined />;
        }

        return (
          <Tag icon={icon} color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Validité',
      dataIndex: 'days',
      key: 'days',
      render: (days) => {
        let color = 'blue';
        let icon = <CheckCircleOutlined />;
        if (days <= 0) {
          color = 'red';
          icon = <ExclamationCircleOutlined />;
        } else if (days <= 7) {
          color = 'orange';
          icon = <ExclamationCircleOutlined />;
        }

        return (
          <Tag icon={icon} color={color}>
            {days} jours
          </Tag>
        );
      },
    },
    {
      title: 'Reste(s)',
      dataIndex: 'days_restant',
      key: 'days_restant',
      render: (days_restant) => {
        let color = 'green';
        let icon = <CheckCircleOutlined />;
        if (days_restant === 0) {
          color = 'red';
          icon = <ExclamationCircleOutlined />;
        } else if (days_restant <= 7) {
          color = 'orange';
          icon = <ClockCircleOutlined />;
        }

        return (
          <Tag icon={icon} color={color}>
            {days_restant} jours
          </Tag>
        );
      },
    },
    {
      title: 'Date & heure',
      dataIndex: 'date_recharge',
      key: 'date_recharge',
      sorter: (a, b) => moment(a.date_recharge) - moment(b.date_recharge),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color='blue'>
          {moment(text).format('DD-MM-YYYY HH:mm')}
        </Tag>
      ),
    },
    {
        title: 'Réchargé par',
        dataIndex: 'username',
        key: 'username',
        render: (text) => (
          <Tag color='blue'>
            <UserOutlined style={{ marginRight: 5 }} />
            {text}
          </Tag>
        ),
      },
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
/*       {
        title: 'Marque',
        dataIndex: 'nom_marque',
        key: 'nom_marque',
        render: (text) => (
          <Tag color='blue'>
            <CarOutlined style={{ marginRight: "5px" }} />
            {text}
          </Tag>
        ),
      }, */
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
        render: (status) => {
          let color = 'blue';
          let icon = <CheckCircleOutlined />;
          if (status === "Inactif") {
            color = 'red';
            icon = <StopOutlined />;
          }
  
          return (
            <Tag icon={icon} color={color}>
              {status}
            </Tag>
          );
        },
      },
      {
        title: 'Validité',
        dataIndex: 'days',
        key: 'days',
        render: (days) => {
          let color = 'blue';
          let icon = <CheckCircleOutlined />;
          if (days <= 0) {
            color = 'red';
            icon = <ExclamationCircleOutlined />;
          } else if (days <= 7) {
            color = 'orange';
            icon = <ExclamationCircleOutlined />;
          }
  
          return (
            <Tag icon={icon} color={color}>
              {days} jours
            </Tag>
          );
        },
      },
      {
        title: 'Reste(s)',
        dataIndex: 'days_restant',
        key: 'days_restant',
        render: (days_restant) => {
          let color = 'green';
          let icon = <CheckCircleOutlined />;
          if (days_restant === 0) {
            color = 'red';
            icon = <ExclamationCircleOutlined />;
          } else if (days_restant <= 7) {
            color = 'orange';
            icon = <ClockCircleOutlined />;
          }
  
          return (
            <Tag icon={icon} color={color}>
              {days_restant} jours
            </Tag>
          );
        },
      },
      {
        title: 'Date & heure',
        dataIndex: 'date_recharge',
        key: 'date_recharge',
        sorter: (a, b) => moment(a.date_recharge) - moment(b.date_recharge),
        sortDirections: ['descend', 'ascend'],
        render: (text) => (
          <Tag icon={<CalendarOutlined />} color='blue'>
            {moment(text).format('DD-MM-YYYY HH:mm')}
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

    return <Table columns={columns} dataSource={record.records} scroll={scroll} pagination={{ pageSize: 15 }} rowKey="id_recharge" />;
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
              { title: 'Accueil',href: '/' },
              { title: 'Recharge' },
            ]}
          />
          <div className="client_wrapper_center_bottom">
            <div className="product-bottom-top">
              <div className="product-bottom-left">
                <Button
                  icon={openTrie ? <CloseOutlined /> : <SisternodeOutlined />}
                  onClick={() => setOpenTrie(!openTrie)}
                />
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
            {openTrie && (
              <RechargeTrie start_date={setStartDate} end_date={setEndDate} />
            )}
            { loading ? (
                <Skeleton active />
            ) : (
                <Table
                columns={columns}
                expandable={{ expandedRowRender }}
                dataSource={filteredData}
                loading={loading}
                rowKey="id_client"
                className='table_client'
                />
            )

            }

            <Modal
              title=""
              centered
              open={open}
              onCancel={closeModal}
              width={1000}
              footer={null}
            >
              <Recharge_form onClose={closeModal} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recharge;
