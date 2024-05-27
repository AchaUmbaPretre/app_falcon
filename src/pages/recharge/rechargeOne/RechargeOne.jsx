import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, Tag } from 'antd';
import { UserOutlined, PhoneOutlined, SisternodeOutlined,BarcodeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import config from '../../../config';

const RechargeOne = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const id_client = new URLSearchParams(location.search).get('id_client');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/recharge/rechargerClientOne?id_client=${id_client}`);
        setData(data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN, id_client]);

  

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Nom',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
        title: 'Numero série',
        dataIndex: 'numero_serie',
        key: 'numero_serie',
        render: (text, record) => (
          <div>
            <Tag color={'blue'}>
              <BarcodeOutlined style={{ marginRight: "5px" }} />
              {text}
            </Tag>
          </div>
        )
      },
    {
      title: 'Numero',
      dataIndex: 'numero',
      key: 'numero',
      render: (text, record) => (
        <div>
          <Tag color={'green'}><PhoneOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    }
  ];

  const filteredData = data?.filter((item) =>
    item.numero?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
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
                    <input type="search" name="" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Recherche...' className='product-search' />
                  </div>
                </div>
                <div className="product-bottom-right">
                </div>
              </div>
              <Table
                dataSource={data}
                columns={columns}
                rowSelection={rowSelection}
                loading={loading}
                rowKey="id_numero"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RechargeOne;
