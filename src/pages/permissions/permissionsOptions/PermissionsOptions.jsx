import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  notification,
  Space,
  Tooltip,
  Tag,
  Modal,
  Tabs,
  Empty 
} from 'antd';
import {
  SolutionOutlined,
  UserOutlined,
  EyeOutlined,
  UnlockOutlined,
  KeyOutlined,
  SafetyOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { getUsers } from '../../../services/user.service';
import PermissionOptionsForm from './permissionOptionsForm/PermissionOptionsForm';

const PermissionsOptions = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [idUser, setIdUser] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const handleEdit = (id) => {
      setIdUser(id);
      setIsModalVisible(true);
    };

    const handleModalClose = () => {
      setIsModalVisible(false);
      setIdUser('');
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await getUsers();
          const userData = response.data || response;
          setData(Array.isArray(userData) ? userData : []);
          setLoading(false);
        } catch (error) {
          notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
          });
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    const columns = [
      {
        title: '#',
        dataIndex: 'id',
        key: 'id',
        render: (_, __, index) => index + 1,
        width: '5%',
      },
      {
        title: 'Nom',
        dataIndex: 'nom',
        key: 'nom',
        render: (text) => (
          <Space>
            <Tag icon={<UserOutlined />} color="blue">{text || 'Non défini'}</Tag>
          </Space>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (text) => text || '-',
      },
      {
        title: 'Rôle',
        dataIndex: 'role',
        key: 'role',
        render: (text) => (
          <Space>
            <Tag icon={<SolutionOutlined />} color="purple">{text || 'Utilisateur'}</Tag>
          </Space>
        ),
      },
      {
        title: 'Permissions',
        key: 'permissions',
        width: '15%',
        render: (_, record) => (
          <Space>
            <Tooltip title="Gérer les permissions">
              <Button
                type="primary"
                icon={<KeyOutlined />}
                onClick={() => handleEdit(record.id_utilisateur || record.id)}
                size="small"
              >
                Permissions
              </Button>
            </Tooltip>
          </Space>
        ),
      }
    ];

    return (
      <>
        <div className="permissions-options-container">
          <Table 
            dataSource={data}
            columns={columns}
            rowKey={(record) => record.id_utilisateur || record.id || Math.random()}
            bordered
            loading={loading}
            pagination={{ 
              pageSize: pagination.pageSize,
              current: pagination.current,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} utilisateur${total > 1 ? 's' : ''}`,
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
              },
            }}
            locale={{ 
              emptyText: <Empty description="Aucun utilisateur trouvé" /> 
            }}
          />
        </div>

        <Modal
          title={
            <Space>
              <SafetyOutlined style={{ color: '#faad14' }} />
              <span>Gestion des permissions</span>
            </Space>
          }
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Fermer
            </Button>,
            <Button key="save" type="primary" icon={<UnlockOutlined />}>
              Enregistrer
            </Button>,
          ]}
          width={900}
        >
          <PermissionOptionsForm/>
        </Modal>
      </>
    ); 
};

export default PermissionsOptions;