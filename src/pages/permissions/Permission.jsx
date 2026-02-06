import React, { useEffect, useState } from 'react';
import './permissions.css';
import { Table, Button, Space, Popover, Typography, Tag, Skeleton } from 'antd';
import { EyeOutlined, UserOutlined, SolutionOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import { Link, useNavigate } from 'react-router-dom';
const { Text } = Typography;

const Permission = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/users`);
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [DOMAIN]);

    const showDrawer = (id) => {
        navigate(`/permissionOne?userId=${id}`);
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
            title: <span><UserOutlined /> Utilisateur</span>,
            dataIndex: 'username',
            key: 'username',
            render: (text, record) => (
                <Text type='secondary'>
                    <UserOutlined style={{ marginRight: "5px" }} />
                    {text}
                </Text>
            ),
        },
        {
            title: <span><SolutionOutlined /> Rôle</span>,
            dataIndex: 'role',
            key: 'role',
            render: (text) => (
                <Text type='secondary'>
                    <SolutionOutlined style={{ marginRight: "5px" }} />
                    {text}
                </Text>
            ),
        },
        {
            title: <span><EyeOutlined /> Action</span>,
            key: 'action',
            width: '120px',
            render: (text, record) => (
                <Space size="middle">
                    <Popover title="Voir les permissions" trigger="hover">
                        <Link onClick={() => showDrawer(record.id)}>
                            <Button icon={<EyeOutlined />} style={{ color: 'green' }} />
                        </Link>
                    </Popover>
                </Space>
            ),
        },
    ];

    return (
        <div className="permission-page">
            <h1>Gestion des permissions</h1>
            <div className="permission-wrapper">
                {loading ? (
                    <Skeleton active />
                ) : (
                    <Table dataSource={users} columns={columns} rowKey="id" />
                )}
            </div>
        </div>
    );
};

export default Permission;
