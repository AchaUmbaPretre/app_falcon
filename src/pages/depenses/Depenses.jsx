import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Drawer, Modal, Popconfirm, Popover, Space, Table, Tag, Input } from 'antd';
import {
  PlusCircleOutlined, CreditCardOutlined, EyeOutlined, DeleteOutlined,
  UserOutlined, DollarOutlined, CalendarOutlined, FilePdfOutlined,
  FileExcelOutlined, PrinterOutlined, SearchOutlined
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import moment from 'moment';
import DepenseForm from './form/DepenseForm';

const Depenses = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [depenses, setDepenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const scroll = { x: 400 };

  const fetchDepenses = useCallback(async () => {
    try {
      const response = await axios.get(`${DOMAIN}/depense`);
      setDepenses(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchDepenses();
  }, [fetchDepenses]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/depense/${id}`);
      fetchDepenses();
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Agent',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: '5px' }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Catégorie',
      dataIndex: 'nom_categorie',
      key: 'nom_categorie',
      render: (text) => (
        <Tag color="orange">
          {text}
        </Tag>
      )
    },
    {
        title: 'En dollars',
        dataIndex: 'montant',
        key: 'montant',
        sorter: (a, b) => a.montant - b.montant,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <Tag color={record.montant !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
            {record.montant ? record.montant + ' $' : '0'}
          </Tag>
        ),
      },
      {
        title: 'En franc',
        dataIndex: 'montant_franc',
        key: 'montant_franc',
        sorter: (a, b) => a.montant_franc - b.montant_franc,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <Tag color={record.montant_franc !== null ? 'green' : 'red'}>
            {record.montant_franc !== null ? record.montant_franc + ' fc' : '0' + ' fc'}
          </Tag>
        ),
      },
      {
        title: 'Montant total $',
        dataIndex: 'montant_total_combine',
        key: 'montant_total_combine',
        sorter: (a, b) => a.montant_total_combine - b.montant_total_combine,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <Tag color={record.montant_total_combine !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
            {record.montant_total_combine ? record.montant_total_combine + ' $' : '0' + ' $'}
          </Tag>
        ),
      },
    {
      title: 'Date',
      dataIndex: 'date_depense',
      key: 'date_depense',
      sorter: (a, b) => moment(a.date_depense) - moment(b.date_depense),
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
          <Popover title="Supprimer" trigger="hover">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer?"
              onConfirm={() => handleDelete(record.id_depense)}
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

  const filteredData = depenses.filter((item) =>
    item.username.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_categorie.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Dépense</h2>
              <span className="client_span">Liste des dépenses</span>
            </div>
            <div className="client_text_right">
              <Button onClick={openModal} icon={<PlusCircleOutlined />} />
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb separator=">" items={[{ title: 'Accueil' }, { title: 'Dépense', href: '/' }]} />
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
            <Table
              dataSource={filteredData}
              columns={columns}
              loading={isLoading}
              scroll={scroll}
              className='table_client'
            />
            <Modal
              title=""
              centered
              open={isModalOpen}
              onCancel={closeModal}
              width={800}
              footer={null}
            >
              <DepenseForm onClose={closeModal} />
            </Modal>
            <Drawer
              title="Détails"
              placement="right"
              onClose={closeDrawer}
              open={isDrawerOpen}
            >
              {/* Contenu détaillé du traceur ici */}
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Depenses;
