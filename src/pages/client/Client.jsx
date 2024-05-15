import React, { useEffect, useState } from 'react'
import './client.scss'
import { Breadcrumb, Modal, Table, Tag } from 'antd'
import { PlusCircleOutlined,UserOutlined,PhoneOutlined,MailOutlined,EnvironmentOutlined,TeamOutlined, SisternodeOutlined,FilePdfOutlined,FileExcelOutlined,PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import ClientForm from './form/ClientForm';
import config from '../../config';
import axios from 'axios';

const Client = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/client`);
        setData(data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const rowClassName = () => {
    return 'font-size-18'; // Nom de la classe CSS personnalisée
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width:"3%"},
    {
      title: 'Nom',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render : (text,record)=>(
        <div>
          <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Nom principal',
      dataIndex: 'nom_principal',
      key: 'nom_principal',
      render : (text,record)=>(
        <div>
          <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Poste',
      dataIndex: 'poste',
      key: 'poste',
      render : (text,record)=>(
        <div>
          <Tag color={'blue'}><TeamOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Telephone',
      dataIndex: 'telephone',
      key: 'telephone',
      render : (text,record)=>(
        <div>
          <Tag color={'blue'}><PhoneOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
      render: (text, record) => (
        <Tag color={'blue'}>
          <EnvironmentOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => (
        <Tag color={'blue'}>
           <MailOutlined style={{ marginRight: "5px" }} />
           {text}
        </Tag>
      )
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
                <h2 className="client_h2">Client</h2>
                <span className="client_span">Liste des clients</span>
              </div>
              <div className="client_text_right">
                <button onClick={showModal}><PlusCircleOutlined /></button>
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
                    title: 'Application Center',
                    href: '/',
                  }
                ]}
            />
            <div className="client_wrapper_center_bottom">
                <div className="product-bottom-top">
                  <div className="product-bottom-left">
                    <SisternodeOutlined className='product-icon' />
                    <div className="product-row-search">
                      <SearchOutlined className='product-icon-plus'/>
                      <input type="search" name="" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}  placeholder='Recherche...' className='product-search' />
                    </div>
                  </div>
                  <div className="product-bottom-right">
                    <FilePdfOutlined className='product-icon-pdf' />
                    <FileExcelOutlined className='product-icon-excel'/>
                    <PrinterOutlined className='product-icon-printer'/>
                  </div>
                </div>

                <Modal
                  title=""
                  centered
                  open={open}
                  onCancel={() => setOpen(false)}
                  width={1000}
                  footer={[
                            ]}
                >
                  <ClientForm />
                </Modal>

                <Table dataSource={data} columns={columns} rowClassName={rowClassName}  />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Client