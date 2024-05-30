import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Drawer, Modal, Popconfirm, Popover, Space, Table, Tag, Input } from 'antd';
import {
  PlusCircleOutlined, CreditCardOutlined, EyeOutlined, DeleteOutlined,
  UserOutlined, DollarOutlined, CalendarOutlined, FilePdfOutlined,
  FileExcelOutlined, PrinterOutlined, SearchOutlined, BarcodeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import moment from 'moment';
import { Link } from 'react-router-dom';
import DetteForm from './form/DetteForm';

const Dette = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const scroll = { x: 400 };

  const fetchPaiements = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/paiement/dette`);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchPaiements();
  }, [fetchPaiements]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/paiement/${id}`);
      fetchPaiements();
    } catch (err) {
      console.error(err);
    }
  };

  const showDrawer = (id) => {
    setOpenDetail(true);
  };

  const showModal = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpenDetail(false);
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: '5px' }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (text, record) => (
        <Tag color='green'>
          <DollarOutlined style={{ marginRight: '5px' }} />
          {text} $
        </Tag>
      )
    },
    {
        title: 'Montant payé',
        dataIndex: 'montant_paye',
        key: 'montant_paye',
        render: (text, record) => (
          <Tag color='green'>
            <DollarOutlined style={{ marginRight: '5px' }} />
            {text} $
          </Tag>
        )
      },
    {
      title: "Date",
      dataIndex: 'date_creation',
      key: 'date_creation',
      sorter: (a, b) => moment(a.date_creation) - moment(b.date_creation),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popover title="Voir les détails" trigger="hover">
            <Link onClick={() => showDrawer(record.id_paiement)}>
              <Button icon={<EyeOutlined />} style={{ color: 'blue' }} />
            </Link>
          </Popover>
          <Popover title="Supprimer" trigger="hover">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer?"
              onConfirm={() => handleDelete(record.id_paiement)}
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

  const filteredData = data?.filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.device?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Dette</h2>
                <span className="client_span">Liste des dettes</span>
              </div>
              <div className="client_text_right">
                <Button onClick={showModal} icon={<PlusCircleOutlined />} />
              </div>
            </div>
          </div>
          <div className="client_wrapper_center">
            <Breadcrumb separator=">" items={[{ title: 'Accueil' }, { title: 'Rétourné(e)', href: '/' }]} />
            <div className="client_wrapper_center_bottom">
              <div className="product-bottom-top">
                <div className="product-bottom-left">
                  <CreditCardOutlined className='product-icon' />
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
              <Table dataSource={filteredData} columns={columns} loading={isLoading} scroll={scroll} className='table_client' />
              <Modal
                title=""
                centered
                open={open}
                onCancel={() => setOpen(false)}
                width={900}
                footer={null}
              >
                 <DetteForm />
              </Modal>
              <Drawer
                title="Détails"
                placement="right"
                onClose={onClose}
                open={openDetail}
              >
                {/* Contenu détaillé du traceur ici */}
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dette;
