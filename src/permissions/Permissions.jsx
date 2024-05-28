import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Button, message } from 'antd';
import axios from 'axios';
import './permissions.css';
import config from '../config';

const Permissions = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(`${DOMAIN}/users`);
      setUsers(data);
    };

    const fetchPermissions = async () => {
      const { data } = await axios.get(`${DOMAIN}/menu/permissions`);
      setPermissions(data);
    };

    const fetchUserPermissions = async () => {
      const { data } = await axios.get(`${DOMAIN}/menu/user-permissions`);
      const userPermissionsMap = data.reduce((acc, perm) => {
        if (!acc[perm.user_id]) {
          acc[perm.user_id] = {};
        }
        if (perm.menu_title) {
          if (!acc[perm.user_id][perm.menu_title]) {
            acc[perm.user_id][perm.menu_title] = {};
          }
          acc[perm.user_id][perm.menu_title][perm.permission] = true;
        }
        if (perm.submenu_title) {
          if (!acc[perm.user_id][perm.submenu_title]) {
            acc[perm.user_id][perm.submenu_title] = {};
          }
          acc[perm.user_id][perm.submenu_title][perm.permission] = true;
        }
        return acc;
      }, {});
      setUserPermissions(userPermissionsMap);
    };

    fetchUsers();
    fetchPermissions();
    fetchUserPermissions();
    
  }, [DOMAIN]);

  const handlePermissionChange = (userId, title, permission, checked) => {
    setUserPermissions(prev => {
      const updatedPermissions = { ...prev };
      if (!updatedPermissions[userId]) {
        updatedPermissions[userId] = {};
      }
      if (!updatedPermissions[userId][title]) {
        updatedPermissions[userId][title] = {};
      }
      updatedPermissions[userId][title][permission] = checked;
      return updatedPermissions;
    });
  };

  const handleSave = async () => {
    try {
      for (const userId in userPermissions) {
        const permissionIds = [];
        for (const title in userPermissions[userId]) {
          for (const permission in userPermissions[userId][title]) {
            if (userPermissions[userId][title][permission]) {
              const permissionData = permissions.find(p => p.name === permission);
              if (permissionData) {
                permissionIds.push(permissionData.id);
              }
            }
          }
        }
        await axios.post(`${DOMAIN}/menu/permissions/user-permissions`, { userId, permissionIds });
      }
      message.success('Permissions mises à jour avec succès');
    } catch (error) {
      message.error('Erreur lors de la mise à jour des permissions');
    }
  };

  const columns = [
    {
      title: 'Utilisateur',
      dataIndex: 'username',
      key: 'username',
    },
    ...permissions.map(permission => ({
      title: permission.name,
      dataIndex: permission.name,
      key: permission.name,
      render: (text, record) => (
        <Checkbox
          checked={
            userPermissions[record.id] &&
            Object.values(userPermissions[record.id]).some(titles =>
              Object.keys(titles).includes(permission.name)
            )
          }
          onChange={e => handlePermissionChange(record.id, 'all', permission.name, e.target.checked)}
        />
      ),
    })),
  ];

  return (
    <div className="permission-page">
      <h1>Gestion des permissions</h1>
      <Table dataSource={users} columns={columns} rowKey="id" />
      <Button type="primary" onClick={handleSave}>Enregistrer les modifications</Button>
    </div>
  );
};

export default Permissions
