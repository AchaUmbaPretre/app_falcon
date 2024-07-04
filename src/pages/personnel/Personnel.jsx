import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Input, Skeleton, Table, Tag } from 'antd'
import { PlusCircleOutlined, SisternodeOutlined,SettingOutlined,PhoneOutlined,MailOutlined,UserOutlined,FilePdfOutlined,FileExcelOutlined,PrinterOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';

const Personnel = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scroll = { x: 400 };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/users`);
        setData(data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);


  const columns = [
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => index + 1, 
      width: "5%" 
    },
    {
      title: 'Nom',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Tag color={'blue'}>
          <UserOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => (
        <Tag color={'geekblue'}>
          <SettingOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (text) => (
        <Tag color={'green'}>
          <PhoneOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Tag color={'volcano'}>
          <MailOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          {/* Exemple d'actions possibles */}
          <Tag color={'purple'}>Edit</Tag>
          <Tag color={'red'}>Delete</Tag>
        </div>
      ),
    },
  ];

  const showModal = (e) => {
    setOpen(true);
  };
    
  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Personnel</h2>
                <span className="client_span">Liste du personnel</span>
              </div>
              <div className="client_text_right">
                <button ><PlusCircleOutlined /></button>
              </div>
            </div>
          </div>
          <div className="client_wrapper_center">
            <Breadcrumb
                separator=">"
                items={[
                  {
                    title: 'Accueil',
                    href: '/',
                  },
                  {
                    title: 'Personnel'
                  }
                ]}
            />
            <div className="client_wrapper_center_bottom">
                <div className="product-bottom-top">
                  <div className="product-bottom-left">
                    <Button
                      icon={<SisternodeOutlined />}
                    />
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
                  <div className="product-bottom-right">
                    <Button className="product-icon-pdf" icon={<FilePdfOutlined />} />
                    <Button  className="product-icon-excel" icon={<FileExcelOutlined />} />
                    <Button className="product-icon-printer" icon={<PrinterOutlined />} />
                  </div>
                </div>
                { loading ? (
                  <Skeleton active />
                ) : (
                  <Table dataSource={data} columns={columns} loading={loading} scroll={scroll} className='table_client' />
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Personnel