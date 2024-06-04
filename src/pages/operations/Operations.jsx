import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Drawer, Modal, Popconfirm, Popover, Skeleton, Space, Table, Tag } from 'antd';
import {
  PlusCircleOutlined, SisternodeOutlined, UserOutlined, CloseOutlined,
  ThunderboltOutlined, ToolOutlined, DeleteOutlined, EyeOutlined,
  EnvironmentOutlined, CalendarOutlined, FilePdfOutlined, FileExcelOutlined,
  PrinterOutlined, SearchOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import config from '../../config';
import OperationDetail from './operationDetail/OperationDetail';
import OperationGen from './form/OperationGen';
import OperationTrier from './operationTrier/OperationTrier';
import OperationTableau from './operationDetail/OperationTableau';

const Operations = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedOperationIds, setSelectedOperationIds] = useState([]);
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [openTrie, setOpenTrie] = useState(false);
  const scroll = { x: 400 };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedOperationIds(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const fetchOperations = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${DOMAIN}/operation`, {
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
    fetchOperations();
  }, [fetchOperations]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/api/commande/commande/${id}`);
      fetchOperations();
    } catch (error) {
      console.error('Failed to delete operation:', error);
    }
  };

  const getColorForOperationType = (type) => {
    switch (type) {
      case 'Installation':
        return 'blue';
      case 'Démantèlement':
        return 'red';
      case 'Contrôle technique':
        return 'green';
      case 'Remplacement':
        return 'orange';
      default:
        return 'default';
    }
  };

  const showDrawer = () => {
    setOpenDetail(true);
  };

  const closeDrawer = () => {
    setOpenDetail(false);
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (_, __, index) => index + 1, width: "3%" },
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
      title: 'Site',
      dataIndex: 'nom_site',
      key: 'nom_site',
      render: (text) => (
        <Tag color='volcano'>
          <EnvironmentOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
    },
    {
      title: "Type d'opération",
      dataIndex: 'type_operations',
      key: 'type_operations',
      render: (text) => (
        <Tag color={getColorForOperationType(text)}>
          <ThunderboltOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Superviseur',
      dataIndex: 'superviseur',
      key: 'superviseur',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Technicien',
      dataIndex: 'technicien',
      key: 'technicien',
      render: (text) => (
        <Tag color='blue'>
          <ToolOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
    },
    {
      title: "Date d'opération",
      dataIndex: 'date_operation',
      key: 'date_operation',
      sorter: (a, b) => moment(a.date_operation) - moment(b.date_operation),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      ),
    },
    {
      title: 'Crée(e) par',
      dataIndex: 'user_cr',
      key: 'user_cr',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popover title="Voir les détails" trigger="hover">
            <Button icon={<EyeOutlined />} style={{ color: 'green' }} onClick={showDrawer} />
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
      ),
    },
  ];

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Opérations</h2>
              <span className="client_span">Liste des opérations</span>
            </div>
            <div className="client_text_right">
              <Button icon={<PlusCircleOutlined />} onClick={() => setOpen(true)} />
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb separator=">" items={[{ title: 'Accueil', href: '/' }, { title: 'Opérations' }]} />
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
              <OperationTrier getProduits={setData} start_date={setStartDate} end_date={setEndDate} />
            )}
            { loading ? (
              <Skeleton active />
            ) : (
              <Table
              dataSource={data}
              columns={columns}
              rowSelection={rowSelection}
              loading={loading}
              rowKey="id_operations"
              className='table_client'
              scroll={scroll}
            />
            )}
            
            <Modal
              title=""
              centered
              visible={open}
              onCancel={() => setOpen(false)}
              width={700}
              footer={null}
            >
              <OperationGen />
            </Modal>
            <Drawer
              title="Détail"
              onClose={closeDrawer}
              visible={openDetail}
              width={800}
            >
              <OperationTableau selectedOperations={selectedOperationIds} />
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operations;
