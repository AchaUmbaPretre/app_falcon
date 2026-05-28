import React from 'react';
import { Tabs } from 'antd';
import { 
    CarOutlined, 
    SettingOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import { UserTable } from './UserTable';
import PermVehicule from '../permVehicule/PermVehicule';
import PermissionsOptions from '../permissionsOptions/PermissionsOptions';

export const PermissionTabs = ({
    activeKey,
    onTabChange,
    users,
    loading,
    onViewUser
}) => {
    const tabItems = [
        {
            key: "1",
            label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <SafetyOutlined style={{ color: "#faad14" }} />
                    Permissions
                </span>
            ),
            children: (
                <div className="permission-page">
                    <h1>Gestion des permissions</h1>
                    <div className="permission-wrapper">
                        <UserTable 
                            users={users}
                            loading={loading}
                            onViewUser={onViewUser}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: "2",
            label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CarOutlined style={{ color: "#1890ff" }} />
                    Permission véhicule
                </span>
            ),
            children: <PermVehicule />,
        },
        {
            key: "3",
            label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <SettingOutlined style={{ color: "#52c41a" }} />
                    Permissions options
                </span>
            ),
            children: <PermissionsOptions />,
        },
    ];
    
    return (
        <Tabs 
            activeKey={activeKey} 
            onChange={onTabChange} 
            items={tabItems}
            type="card"
            size="large"
        />
    );
};