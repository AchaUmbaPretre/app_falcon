import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Checkbox, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../../config';
import useQuery from '../../../useQuery';

const PermissionOne = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const query = useQuery();
  const userId = query.get('userId');
  const [options, setOptions] = useState([]);
  const [permissions, setPermissions] = useState({});

  console.log(userId)

  useEffect(() => {
    const fetchOptionsAndPermissions = async () => {
      try {
        const [optionsRes, permissionsRes] = await Promise.all([
          axios.get(`${DOMAIN}/menu/menuAll`),
          axios.get(`${DOMAIN}/users/${userId}/permissions`)
        ]);

        setOptions(optionsRes.data);
        const perms = {};
        permissionsRes.data.forEach(p => {
          perms[p.menus_id] = { can_read: p.can_read, can_edit: p.can_edit, can_delete: p.can_delete };
        });
        setPermissions(perms);
      } catch (error) {
        message.error('Failed to fetch data');
      }
    };

    fetchOptionsAndPermissions();
  }, [userId]);

  const handlePermissionChange = (optionId, permType, value) => {
    const updatedPermissions = {
      ...permissions,
      [optionId]: {
        ...permissions[optionId],
        [permType]: value
      }
    };
    setPermissions(updatedPermissions);

    axios.put(`/api/users/${userId}/permissions/${optionId}`, updatedPermissions[optionId])
      .then(() => {
        message.success('Permissions updated successfully');
      })
      .catch(() => {
        message.error('Failed to update permissions');
      });
  };

  const columns = [
    {
      title: 'Option',
      dataIndex: 'menu_title',
      key: 'menu_title',
    },
    {
      title: 'Read',
      dataIndex: 'can_read',
      key: 'can_read',
      render: (text, record) => (
        <Checkbox
          checked={permissions[record.id]?.can_read || false}
          onChange={e => handlePermissionChange(record.id, 'can_read', e.target.checked)}
        />
      )
    },
    {
      title: 'Edit',
      dataIndex: 'can_edit',
      key: 'can_edit',
      render: (text, record) => (
        <Checkbox
          checked={permissions[record.id]?.can_edit || false}
          onChange={e => handlePermissionChange(record.id, 'can_edit', e.target.checked)}
        />
      )
    },
    {
      title: 'Delete',
      dataIndex: 'can_delete',
      key: 'can_delete',
      render: (text, record) => (
        <Checkbox
          checked={permissions[record.id]?.can_delete || false}
          onChange={e => handlePermissionChange(record.id, 'can_delete', e.target.checked)}
        />
      )
    }
  ];

  return (
    <Table
      dataSource={options}
      columns={columns}
      rowKey="id"
      pagination={false}
    />
  );
};

export default PermissionOne;
