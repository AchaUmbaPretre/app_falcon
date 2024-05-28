import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, Tag, message, Input, Button } from 'antd';
import { UserOutlined, PhoneOutlined, SisternodeOutlined, BarcodeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import config from '../../../config';

const RechargeOne = () => {
  // Constants
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const INITIAL_DAYS = 0;

  // State variables
  const [searchValue, setSearchValue] = useState('');
  const [days, setDays] = useState(INITIAL_DAYS);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useSelector((state) => state.user.currentUser.id);

  const id_client = new URLSearchParams(location.search).get('id_client');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/recharge/rechargerClientOne?id_client=${id_client}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        message.error('Erreur lors de la récupération des données.');
      }
    };
    fetchData();
  }, [DOMAIN, id_client]);

  // Handle row selection change
  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  // Table row selection config
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Table columns definition
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%"
    },
    {
      title: 'Nom',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Numero série',
      dataIndex: 'numero_serie',
      key: 'numero_serie',
      render: (text) => (
        <Tag color='blue'>
          <BarcodeOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Numero',
      dataIndex: 'numero',
      key: 'numero',
      render: (text) => (
        <Tag color='green'>
          <PhoneOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      )
    }
  ];

  console.log(selectedRowKeys)

  // Handle recharge button click
  const handleRecharge = async (e) => {
    e.preventDefault();

    if (selectedRowKeys.length === 0) {
      message.error('Veuillez sélectionner au moins une ligne.');
      return;
    }

    if (days <= 0) {
      message.error('Veuillez entrer un nombre de jours valide.');
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        selectedRowKeys.map((item) =>
          axios.post(`${DOMAIN}/recharge`, {
            id_numero: item,
            user_cr: userId,
            days: days
          })
        )
      );

      message.success('Produit rechargé avec succès !');
      navigate('/recharge');
      window.location.reload();
    } catch (err) {
      message.error(`Erreur lors du rechargement : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.numero?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Recharge</h2>
              <span className="client_span"></span>
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb
            separator=">"
            items={[
              {
                title: 'Accueil',
              },
              {
                title: 'Rétourné(e)',
                href: '/',
              }
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
                <label htmlFor="" style={{fontSize:'13px', color: "#555"}}>Nbre de jour : </label>
                <Input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  placeholder="Nombre de jours"
                  className='days-input'
                  style={{width:"100px"}}
                />
              </div>
            </div>
            <Table
              dataSource={filteredData}
              columns={columns}
              rowSelection={rowSelection}
              loading={loading}
              rowKey="id_numero"
            />
            <Button type="primary" onClick={handleRecharge} disabled={loading}>
              Recharger
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeOne;
