import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Modal, Popconfirm, Popover, Space, Table, Tag, message } from 'antd';
import { PlusCircleOutlined, CarOutlined, UserOutlined, DeleteOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import Vehicules_form from './form/Vehicules_form';

const Vehicules = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${DOMAIN}/vehicule`);
      setData(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/api/commande/commande/${id}`);
      message.success('Vehicle deleted successfully');
      fetchData(); // Refresh data after delete
    } catch (err) {
      console.error(err);
      message.error('Failed to delete vehicle');
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Nom',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Marque',
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      render: (text) => (
        <Tag color='blue'>
          <CarOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
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
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: "160px",
      render: (_, record) => (
        <Space size="middle">
          <Popover title="Supprimer" trigger="hover">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer?"
              onConfirm={() => handleDelete(record.id_vehicule)}
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

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Véhicule</h2>
              <span className="client_span">Liste des véhicules</span>
            </div>
            <div className="client_text_right">
              <Button onClick={showModal} icon={<PlusCircleOutlined />} />
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb separator=">" items={[
            { title: 'Accueil', href: '/' },
            { title: 'Retourné(e)' }
          ]} />
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
                <FilePdfOutlined className='product-icon-pdf' />
                <FileExcelOutlined className='product-icon-excel' />
                <PrinterOutlined className='product-icon-printer' />
              </div>
            </div>
            <Table 
              dataSource={data} 
              columns={columns} 
              rowClassName={() => 'font-size-18'} 
              loading={loading} 
              className='table_client' 
              pagination={{ pageSize: 10 }}
            />
            <Modal
              title="Ajouter un véhicule"
              centered
              open={isModalOpen}
              onCancel={handleCancel}
              width={1000}
              footer={null}
            >
              <Vehicules_form onClose={handleCancel} onSave={fetchData} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vehicules;
