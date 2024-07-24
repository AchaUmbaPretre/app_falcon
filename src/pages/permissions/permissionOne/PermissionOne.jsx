import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Switch, message, Tag, Skeleton } from 'antd';
import { ReadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../../config';
import useQuery from '../../../useQuery';
import './../permissions.css';

const PermissionOne = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const query = useQuery();
  const userId = query.get('userId');
  const [options, setOptions] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptionsAndPermissions = async () => {
      setLoading(true);
      try {
        const [optionsRes, permissionsRes] = await Promise.all([
          axios.get(`${DOMAIN}/menu/menuAll`),
          axios.get(`${DOMAIN}/menu/permissions?userId=${userId}`)
        ]);

        setOptions(optionsRes.data);
        setName(permissionsRes.data[0]?.username || ''); // Correction here
        setLoading(false);

        const perms = {};
        permissionsRes.data.forEach(p => {
          perms[p.menus_id] = {
            can_read: p.can_read,
            can_edit: p.can_edit,
            can_delete: p.can_delete
          };
        });
        setPermissions(perms);
      } catch (error) {
        message.error('Failed to fetch data');
        setLoading(false); // Ensure loading state is reset on error
      }
    };

    fetchOptionsAndPermissions();
  }, [userId, DOMAIN]);

  const handlePermissionChange = (optionId, permType, value) => {
    const updatedPermissions = {
      ...permissions,
      [optionId]: {
        ...permissions[optionId],
        [permType]: value
      }
    };

    const finalPermissions = {
      ...updatedPermissions[optionId],
      can_read: updatedPermissions[optionId].can_read ?? false,
      can_edit: updatedPermissions[optionId].can_edit ?? false,
      can_delete: updatedPermissions[optionId].can_delete ?? false,
    };

    setPermissions(updatedPermissions);

    axios.put(`${DOMAIN}/menu/${userId}/permissions/${optionId}`, finalPermissions)
      .then(() => {
        message.success('Autorisations mises à jour avec succès');
      })
      .catch(() => {
        message.error('Échec de la mise à jour des autorisations');
      });
  };

  const columns = [
    { 
      title: <span>#</span>, 
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    {
      title: 'Option',
      dataIndex: 'menu_title',
      key: 'menu_title',
      render: (text) => (
        <Tag color='blue'>{text}</Tag>
      ),
    },
    {
      title: <span style={{ color: '#52c41a' }}><ReadOutlined /> Lire</span>,
      dataIndex: 'can_read',
      key: 'can_read',
      render: (text, record) => (
        <Switch
          checked={permissions[record.menu_id]?.can_read || false}
          onChange={value => handlePermissionChange(record.menu_id, 'can_read', value)}
        />
      )
    },
    {
      title: <span style={{ color: '#1890ff' }}><EditOutlined /> Modifier</span>,
      dataIndex: 'can_edit',
      key: 'can_edit',
      render: (text, record) => (
        <Switch
          checked={permissions[record.menu_id]?.can_edit || false}
          onChange={value => handlePermissionChange(record.menu_id, 'can_edit', value)}
        />
      )
    },
    {
      title: <span style={{ color: '#ff4d4f' }}><DeleteOutlined /> Supprimer</span>,
      dataIndex: 'can_delete',
      key: 'can_delete',
      render: (text, record) => (
        <Switch
          checked={permissions[record.menu_id]?.can_delete || false}
          onChange={value => handlePermissionChange(record.menu_id, 'can_delete', value)}
        />
      )
    }
  ];

  return (
    <div className="permission-page">
      <div className='permission_wrapper'>
        {loading ? (
          <Skeleton active title={false} paragraph={{ rows: 1 }} />
        ) : (
          <h1 className='permission_h1'>Gestion des permissions pour l'utilisateur {name}</h1>
        )}
        {loading ? (
          <Skeleton active title={false} paragraph={{ rows: 2 }} />
        ) : (
          <p className='permission_desc'>Bienvenue dans la gestion des permissions. Cette page vous permet de définir les autorisations spécifiques pour chaque utilisateur.</p>
        )}
      </div>
      <Table
        dataSource={loading ? [] : options}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        className='table_permission' 
      />
    </div>
  );
};

export default PermissionOne;
