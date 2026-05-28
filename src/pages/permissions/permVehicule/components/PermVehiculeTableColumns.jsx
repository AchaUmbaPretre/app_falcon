// PermVehiculeTableColumns.jsx
import React from 'react';
import { Typography, Tag, Popover, Button, Space } from 'antd';
import { 
  TeamOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  FileDoneOutlined 
} from '@ant-design/icons';
import UserAvatarProfile from '../../../../utils/UserAvatarProfile';

const { Text } = Typography;

export const getPermVehiculeTableColumns = ({ onViewUser, handleCopy, pagination }) => [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => {
      return index + 1;
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
    title: 'Actions',
    key: 'action',
    width: '100px',
    render: (_text, record) => (
      <Space size="middle">
        <Popover content={`Donner les permissions à ${record.nom_client}`} trigger="hover">
          <Button 
            icon={<FileDoneOutlined />} 
            onClick={() => onViewUser?.(record.id_client)}
            style={{ color: '#52c41a' }}
            type="text"
          />
        </Popover>
      </Space>
    )
  }
];