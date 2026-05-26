// PermVehiculeTableColumns.jsx
import React from 'react';
import { Text, Tag, Popover, Button, Space } from 'antd';
import { 
  TeamOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  FileDoneOutlined 
} from '@ant-design/icons';
import UserAvatarProfile from './UserAvatarProfile'; // Ajustez le chemin

export const getPermVehiculeTableColumns = ({ onViewUser, handleCopy, pagination }) => [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => {
      const pageSize = pagination?.pageSize || 10;
      const pageIndex = pagination?.current || 1;
      return (pageIndex - 1) * pageSize + index + 1;
    },
    width: "3%"
  },
  {
    title: "Profil",
    key: "profil",
    render: (_, record) => (
      <UserAvatarProfile
        nom={record.nom_client}
        prenom={record.nom_principal}
        email={record.email}
      />
    ),
  },
  {
    title: 'Poste',
    dataIndex: 'poste',
    key: 'poste',
    render: (text, record) => (
      <div>
        <Text type='secondary'>
          <TeamOutlined style={{ marginRight: "5px" }} />{text}
        </Text>
      </div>
    )
  },
  {
    title: 'Téléphone',
    dataIndex: 'telephone',
    key: 'telephone',
    render: (text, record) => (
      <div>
        <Tag color={'green'} onClick={() => handleCopy?.(text)}>
          <PhoneOutlined style={{ marginRight: "5px" }} />{text}
        </Tag>
      </div>
    )
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    render: (text, record) => (
      <Popover content="Cliquez pour ouvrir Gmail" trigger="hover">
        <Tag color="yellow">
          <a href={`mailto:${text}`} target="_blank" rel="noopener noreferrer">
            <MailOutlined style={{ marginRight: '5px' }} />
            {text}
          </a>
        </Tag>
      </Popover>
    )
  },
  {
    title: 'Actions',
    key: 'action',
    width: '100px',
    render: (_text, record) => (
      <Space size="middle">
        <Popover content="Donner les permissions à ce client" trigger="hover">
          <Button 
            icon={<FileDoneOutlined />} 
            onClick={() => onViewUser?.(record.id)}
            style={{ color: '#52c41a' }}
            type="text"
          />
        </Popover>
      </Space>
    )
  }
];