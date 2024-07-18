import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, Tag, message, Input, Button, Modal, Spin } from 'antd';
import { PhoneOutlined, SisternodeOutlined, HourglassOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import config from '../../../config';
import './rechargeOne.css';

const RechargeOne = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clientName, setClientName] = useState('');
  const [defaultDays, setDefaultDays] = useState(0); // State for default number of days

  const navigate = useNavigate();
  const location = useLocation();
  const userId = useSelector((state) => state.user.currentUser.id);

  const id_client = new URLSearchParams(location.search).get('id_client');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/recharge/rechargerClientOne?id_client=${id_client}`);
        setData(response.data.map(row => ({ ...row, days: defaultDays }))); // Initialize days with default value
        setClientName(response.data[0].nom_client);
        setLoading(false);
      } catch (error) {
        console.error(error);
        message.error('Erreur lors de la récupération des données.');
      }
    };
    fetchData();
  }, [DOMAIN, id_client]);

  useEffect(() => {
    setData(prevData => prevData.map(row => ({ ...row, days: defaultDays })));
    setSelectedRows(prevSelectedRows => prevSelectedRows.map(row => ({ ...row, days: defaultDays })));
  }, [defaultDays]);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const handleDaysChange = (id, days) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.map((row) =>
        row.id_numero === id ? { ...row, days } : row
      )
    );
    setData((prevData) =>
      prevData.map((row) =>
        row.id_numero === id ? { ...row, days } : row
      )
    );
  };

  const rowSelection = {
    selectedRowKeys: selectedRows.map((row) => row.id_numero),
    onChange: onSelectChange,
  };

  const handleRecharge = async () => {
    if (selectedRows.length === 0) {
      message.error('Veuillez sélectionner au moins une ligne.');
      return;
    }

    if (selectedRows.some(row => row.days <= 0)) {
      message.error('Veuillez entrer un nombre de jours valide pour chaque ligne sélectionnée.');
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        selectedRows.map((row) =>
          axios.post(`${DOMAIN}/recharge`, {
            id_numero: row.id_numero,
            user_cr: userId,
            days: row.days
          })
        )
      );

      message.success('Numero rechargé avec succès !');
      setIsModalVisible(false);
    } catch (err) {
      message.error(`Erreur lors du rechargement : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleRecharge();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Numéro copié dans le presse-papiers');
    }).catch((err) => {
      message.error('Échec de la copie');
      console.error('Could not copy text: ', err);
    });
  };

  const filteredData = data.filter((item) =>
    item.numero?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%"
    },
    {
      title: 'Numero',
      dataIndex: 'numero',
      key: 'numero',
      render: (text) => (
        <Tag color='green' onClick={() => handleCopy(text)} style={{ cursor: 'pointer' }}>
          <PhoneOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Nbre de jour',
      dataIndex: 'days',
      key: 'days',
      render: (text, record) => (
        <div>
          <Input
            type="number"
            min="1"
            onChange={(e) => handleDaysChange(record.id_numero, Number(e.target.value))}
            value={record.days || ''}
            placeholder="Nombre de jours"
            className='days-input'
            style={{ width: "100px" }}
          />
        </div>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: () => (
        <div>
          <Button type="primary" onClick={showModal} disabled={loading}>
          <HourglassOutlined />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Recharge {clientName}</h2>
              <span className="client_span"></span>
            </div>
            <div className="client_text_right">

            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb
            separator=">"
            items={[
              { title: 'Accueil', href: '/' },
              { title: 'Récharge' },
            ]}
          />
          <div className="client_wrapper_center_bottom">
            <div className="product-bottom-top">
              <div className="product-bottom-left">
                <Button icon={<SisternodeOutlined />}/>
                <div className="product-row-searchs">
                  <Input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Recherche..."
                    className="product-search"
                  />
                </div>
              </div>
              <div className="default-days-input">
              <div style={{fontSize:'13px', color:'#555',marginBottom:'10px'}}>Nbre de jour</div>
              <Input
                type="number"
                min="1"
                value={defaultDays}
                onChange={(e) => setDefaultDays(Number(e.target.value))}
                placeholder="Nombre de jours par défaut"
                style={{ width: "200px", marginRight: "10px" }}
              />
            </div>
            </div>
            <Table
              dataSource={filteredData}
              columns={columns}
              rowSelection={rowSelection}
              loading={loading}
              rowKey="id_numero"
              className='table_client'
            />
            <Modal
              title="Confirmation de Recharge"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              className="custom-modal"
              centered
            >
              <p>Voulez-vous vraiment recharger les numéros sélectionnés ?</p>
              {loading && (
                <div className="loader-container loader-container-center">
                   <Spin size="large" />
                </div>
            )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeOne;
