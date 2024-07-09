import React, { useState, useEffect } from 'react';
import { Table, Checkbox } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PermissionOne = () => {
  const { id } = useParams();
  const [options, setOptions] = useState([]);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    // Récupérer les options disponibles
    axios.get('/api/options')
      .then(response => setOptions(response.data))
      .catch(error => console.error(error));
    
    // Récupérer les permissions de l'utilisateur
    axios.get(`/api/users/${id}/permissions`)
      .then(response => {
        const permissionsMap = response.data.reduce((acc, permission) => {
          acc[permission.option_id] = permission.has_access;
          return acc;
        }, {});
        setPermissions(permissionsMap);
      })
      .catch(error => console.error(error));
  }, [id]);

  const handleCheckboxChange = (optionId, checked) => {
    axios.post(`/api/users/${id}/permissions`, { optionId, hasAccess: checked })
      .then(response => {
        setPermissions(prevPermissions => ({
          ...prevPermissions,
          [optionId]: checked,
        }));
      })
      .catch(error => console.error(error));
  };

  const columns = [
    {
      title: 'Option',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Accès',
      key: 'has_access',
      render: (text, record) => (
        <Checkbox
          checked={permissions[record.id] || false}
          onChange={e => handleCheckboxChange(record.id, e.target.checked)}
        />
      ),
    },
  ];

  return <Table dataSource={options} columns={columns} rowKey="id" />;
};

export default PermissionOne;
