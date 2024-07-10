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

  useEffect(() => {
    const fetchOptionsAndPermissions = async () => {
      try {
        const [optionsRes, permissionsRes] = await Promise.all([
          axios.get(`${DOMAIN}/menu/menuAll`),
          axios.get(`${DOMAIN}/menu/permissions?userId=${userId}`)
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

    const finalPermissions = {
        ...updatedPermissions[optionId],
        can_read: updatedPermissions[optionId].can_read ?? false,
        can_edit: updatedPermissions[optionId].can_edit ?? false,
        can_delete: updatedPermissions[optionId].can_delete ?? false,
      };

    setPermissions(updatedPermissions);

    axios.put(`${DOMAIN}/menu/${userId}/permissions/${optionId}`, finalPermissions)
      .then(() => {
        message.success('Permissions updated successfully');
      })
      .catch(() => {
        message.error('Failed to update permissions');
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
    },
    {
      title: 'Lire',
      dataIndex: 'can_read',
      key: 'can_read',
      render: (text, record) => (
        <Checkbox
          checked={permissions[record.menu_id]?.can_read || false}
          onChange={e => handlePermissionChange(record.menu_id, 'can_read', e.target.checked)}
        />
      )
    },
    {
      title: 'Modifier',
      dataIndex: 'can_edit',
      key: 'can_edit',
      render: (text, record) => (
        <Checkbox
          checked={permissions[record.menu_id]?.can_edit || false}
          onChange={e => handlePermissionChange(record.menu_id, 'can_edit', e.target.checked)}
        />
      )
    },
    {
      title: 'Supprimer',
      dataIndex: 'can_delete',
      key: 'can_delete',
      render: (text, record) => (
        <Checkbox
          checked={permissions[record.menu_id]?.can_delete || false}
          onChange={e => handlePermissionChange(record.menu_id, 'can_delete', e.target.checked)}
        />
      )
    }
  ];

  return (
    <>
        <div className="permission-page">
            <div>
                <h1>Gestion des permissions</h1>
            </div>
                <Table
            dataSource={options}
            columns={columns}
            rowKey="id"
            pagination={false}
            />
        </div>
    </>
  );
};

export default PermissionOne;
