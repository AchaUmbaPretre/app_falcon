import React from 'react';
import { Space, Popover, Button, Typography } from 'antd';
import { EyeOutlined, UserOutlined, SettingOutlined, NumberOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const getUserTableColumns = ({ onViewUser }) => [
    { 
        title: <span><NumberOutlined /></span>, 
        dataIndex: 'id', 
        key: 'id', 
        render: (_text, _record, index) => index + 1, 
        width: "3%" 
    },
    {
        title: <span><UserOutlined /> Utilisateur</span>,
        dataIndex: 'username',
        key: 'username',
        sorter: (a, b) => a.username.localeCompare(b.username),
        render: (text) => (
            <Text type='secondary'>
                <UserOutlined style={{ marginRight: "8px" }} />
                {text}
            </Text>
        ),
    },
    {
        title: <span><SettingOutlined /> Rôle</span>,
        dataIndex: 'role',
        key: 'role',
        filters: [
            { text: 'Admin', value: 'admin' },
            { text: 'User', value: 'user' },
        ],
        onFilter: (value, record) => record.role === value,
        render: (text) => (
            <Text type='secondary'>
                <SettingOutlined style={{ marginRight: "8px" }} />
                {text}
            </Text>
        ),
    },
    {
        title: <span><EyeOutlined /> Action</span>,
        key: 'action',
        width: '100px',
        render: (_text, record) => (
            <Space size="middle">
                <Popover content="Voir les détails" trigger="hover">
                    <Button 
                        icon={<EyeOutlined />} 
                        onClick={() => onViewUser(record.id)}
                        style={{ color: '#52c41a' }}
                        type="text"
                    />
                </Popover>
            </Space>
        ),
    },
];