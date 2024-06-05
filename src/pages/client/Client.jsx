import React, { useEffect, useState } from 'react';
import './client.scss';
import { Breadcrumb, Button, Drawer, Modal, Popconfirm, Popover, Space, Table, Tag, Skeleton } from 'antd';
import { PlusCircleOutlined, UserOutlined, EyeOutlined, DeleteOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import ClientForm from './form/ClientForm';
import config, { userRequest } from '../../config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ClientContact from './clientContact/ClientContact';
import ClientDetail from './clientDetail/ClientDetail';

const Client = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [idClient, setIdClient] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const scroll = { x: 400 };

  const showDrawer = (e) => {
    setOpenDetail(true);
    setIdClient(e);
  };

  const onClose = () => {
    setOpenDetail(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/api/commande/commande/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async (page, pageSize) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/client`, {
        params: { page, limit: pageSize }
      });
      setData(data);
      setLoading(false);
      setPagination((prevPagination) => ({
        ...prevPagination
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [DOMAIN, pagination.current, pagination.pageSize]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

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
      title: 'Poste',
      dataIndex: 'poste',
      key: 'poste',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><TeamOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (text, record) => (
        <div>
          <Tag color={'green'}><PhoneOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
      render: (text, record) => (
        <Tag color={'volcano'}>
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
        <Tag color={'gold'}>
          <MailOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popover title="Voir les détails" trigger="hover">
            <Link onClick={() => showDrawer(record.id_client)}>
              <Button icon={<EyeOutlined />} style={{ color: 'green' }} />
            </Link>
          </Popover>
          <Popover title="Ajouter les contacts" trigger="hover">
            <Button icon={<PlusCircleOutlined />} onClick={() => showModalContact(record.id_client)} style={{ color: 'blue' }} />
          </Popover>
          <Popover title="Supprimer" trigger="hover">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer?"
              onConfirm={() => handleDelete(record.id_client)}
              okText="Oui"
              cancelText="Non"
            >
              <Button icon={<DeleteOutlined />} style={{ color: 'red' }} />
            </Popconfirm>
          </Popover>
        </Space>
      )
    }
  ];

  const showModal = (e) => {
    setOpen(true);
  };

  const showModalContact = (e) => {
    setOpens(true);
    setIdClient(e);
  };

  const filteredData = data?.filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.poste?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.telephone?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.adresse?.toLowerCase().includes(searchValue.toLowerCase())
  );

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
                  href: '/',
                },
                {
                  title: 'Client'
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
                  <FilePdfOutlined className='product-icon-pdf' />
                  <FileExcelOutlined className='product-icon-excel' />
                  <PrinterOutlined className='product-icon-printer' />
                </div>
              </div>

              <Modal
                title=""
                centered
                open={open}
                onCancel={() => setOpen(false)}
                width={1000}
                footer={[]}
              >
                <ClientForm />
              </Modal>

              <Modal
                title=""
                centered
                open={opens}
                onCancel={() => setOpens(false)}
                width={1000}
                footer={[]}
              >
                <ClientContact id_client={idClient} />
              </Modal>

              <Drawer title="Détail" onClose={onClose} visible={openDetail} width={600}>
                <ClientDetail id_client={idClient} />
              </Drawer>
              
              {loading ? (
                <Skeleton active />
              ) : (
                <Table
                  dataSource={filteredData}
                  columns={columns}
                  scroll={scroll}
                  className='table_client'
                  pagination={pagination}
                  onChange={handleTableChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Client;
