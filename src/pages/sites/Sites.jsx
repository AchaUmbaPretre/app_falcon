import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Modal, Popconfirm, Popover, Space, Table, Tag, Input, Skeleton } from 'antd';
import {
  PlusCircleOutlined, EnvironmentOutlined, UserOutlined, DeleteOutlined,
  SisternodeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import SitesForm from './form/SitesForm';

const Sites = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sitesData, setSitesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSites = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${DOMAIN}/operation/site`);
      setSitesData(data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/api/commande/commande/${id}`);
      fetchSites(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (_, __, index) => index + 1, width: '3%' },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color="blue">
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
        <Tag color="volcano">
          <EnvironmentOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width:15,
      render: (_, record) => (
        <Space size="middle">
          <Popover title="Supprimer" trigger="hover">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer?"
              onConfirm={() => handleDelete(record.id_client)}
              okText="Oui"
              cancelText="Non"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Popover>
        </Space>
      ),
    },
  ];

  const handleModalOpen = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);

  const filteredData = sitesData.filter((site) =>
    site.nom_client.toLowerCase().includes(searchValue.toLowerCase()) ||
    site.nom_site.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Sites</h2>
              <span className="client_span">Liste des sites</span>
            </div>
            <div className="client_text_right">
              <Button onClick={handleModalOpen} icon={<PlusCircleOutlined />} type="primary">
                
              </Button>
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb separator=">" items={[{ title: 'Accueil', href: '/' }, { title: 'Sites' }]} />
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
              <div className="product-bottom-right">
              </div>
            </div>
            {isLoading ? (
              <Skeleton active />
            ): (
              <Table
                dataSource={filteredData}
                columns={columns}
                loading={isLoading}
                scroll={{ x: 400 }}
                rowKey="id"
                className="table_client"
              />
            )}
            <Modal
              title=""
              centered
              visible={isModalVisible}
              onCancel={handleModalClose}
              width={900}
              footer={null}
            >
              <SitesForm onClose={handleModalClose} onRefresh={fetchSites} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sites;
