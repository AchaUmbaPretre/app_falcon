import React, { useEffect, useState } from 'react';
import './permissions.css';
import { Table, Button, Space, Popover, Tabs, Typography, Tag, Skeleton } from 'antd';
import { 
  EyeOutlined, 
  UserOutlined, 
  SolutionOutlined, 
  AppstoreOutlined, 
  CarOutlined,
  NumberOutlined,
  SettingOutlined,
  ExportOutlined
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import PermVehicule from './permVehicule/PermVehicule';

const { Text } = Typography;

const Permission = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeKey, setActiveKey] = useState("1");
    
    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/users`);
                setUsers(data);
            } catch (error) {
                console.error('Erreur lors du chargement des utilisateurs:', error);
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
            title: <span><NumberOutlined /></span>, 
            dataIndex: 'id', 
            key: 'id', 
            render: (text, record, index) => index + 1, 
            width: "3%" 
        },
        {
            title: <span><UserOutlined /> Permission d'options</span>,
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
            title: <span><SettingOutlined /> Rôle</span>,
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
                            <Button icon={<EyeOutlined />} style={{ color: '#52c41a' }} />
                        </Link>
                    </Popover>
                </Space>
            ),
        },
    ];

    const tabItems = [
        {
            key: "1",
            label: (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <AppstoreOutlined style={{ color: "#faad14" }} />
                    Gestion des permissions
                </span>
            ),
            children: (
                <div className="permission-page">
                    <h1><ExportOutlined /> Gestion des permissions</h1>
                    <div className="permission-wrapper">
                        {loading ? (
                            <Skeleton active />
                        ) : (
                            <Table 
                                dataSource={users} 
                                columns={columns} 
                                rowKey="id" 
                                pagination={{ pageSize: 10 }}
                            />
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "2",
            label: (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <CarOutlined style={{ color: "#1890ff" }} />
                    Permission véhicule
                </span>
            ),
            children: <PermVehicule />,
        },
    ];

    return (
        <div className="permission-container">
            <Tabs 
                activeKey={activeKey} 
                onChange={handleTabChange} 
                items={tabItems} 
            />
        </div>
    );
};

export default Permission;