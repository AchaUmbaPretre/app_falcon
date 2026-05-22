import React from 'react'
import { Typography, Input, Tabs, Modal, Space, DatePicker, Table, Tag, notification, Spin, Progress, Tooltip } from 'antd';
import { useClientVehicule } from './hooks/useClientVehicule'
import { CarOutlined, DashboardOutlined, ThunderboltOutlined, SignalFilled, NumberOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

import getColumnSearchProps from '../../../utils/columnSearchUtils';
import { computeDowntimeMinutes, formatDurations } from '../../../utils/renderTooltip';
const { Text } = Typography;

const ClientVehicule = ({id_client}) => {
    const { data, loading, mergedCourses } = useClientVehicule(id_client)
    const scroll = { x: 'max-content' };

    const capteurInfoData = Array.isArray(mergedCourses) 
        ? mergedCourses.map(item => item.capteurInfo).filter(Boolean)
        : [];

    const columns = [
        {
            title: (
                <span style={{ color: "#8c8c8c", fontWeight: 500 }}>
                    <NumberOutlined style={{ color: "#1890ff", marginRight: 6 }} />
                </span>
            ),
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => {
                return index + 1;
            },
            width: 60,
        },
        {
            title: (
                <span style={{ color: "#8c8c8c", fontWeight: 500 }}>
                    <CarOutlined style={{ color: "#1890ff", marginRight: 6 }} />
                    Véhicule
                </span>
            ),
            dataIndex: "device_name",
            key: "device_name",
            sorter: (a, b) => (a.device_name || '').localeCompare(b.device_name || ''),
            render: (text) => (
                <strong>
                    <CarOutlined style={{ color: "#1890ff", marginRight: 6 }} />
                    {text || 'N/A'}
                </strong>
            ),
        },
        {
            title: (
                <span style={{ color: "#8c8c8c", fontWeight: 500 }}>
                    <SignalFilled style={{ color: "#722ed1", marginRight: 6 }} />
                    M à j (Taux)
                </span>
            ),
            dataIndex: "taux_connectivite_pourcent",
            key: "taux_connectivite_pourcent",
            sorter: (a, b) => (a.taux_connectivite_pourcent || 0) - (b.taux_connectivite_pourcent || 0),
            render: (value) => {
                const percent = Number((value || 0).toFixed(1));
                const color = percent >= 75 ? "#52c41a" : percent >= 50 ? "#faad14" : "#f5222d";
                return (
                    <Tag color={color} style={{ fontSize: "13px", fontWeight: 500 }}>
                        <SignalFilled style={{ marginRight: 6 }} />
                        {percent}%
                    </Tag>
                );
            },
        },
        {
            title: (
                <span style={{ color: "#8c8c8c", fontWeight: 500 }}>
                    <ClockCircleOutlined style={{ color: "#faad14", marginRight: 6 }} />
                    Dernière
                </span>
            ),
            dataIndex: "derniere_connexion",
            key: "derniere_connexion",
            sorter: (a, b) => {
                const minutesA = computeDowntimeMinutes(a.derniere_connexion);
                const minutesB = computeDowntimeMinutes(b.derniere_connexion);
                return minutesA - minutesB;
            },
            render: (value) => {
                const minutes = computeDowntimeMinutes(value);
                return (
                    <span>
                        <ClockCircleOutlined style={{ marginRight: 6, color: "#faad14" }} />
                        {formatDurations(minutes)}
                    </span>
                );
            },
        },
        {
            title: (
                <span style={{ color: "#8c8c8c", fontWeight: 500 }}>
                    <ThunderboltOutlined style={{ color: "#13c2c2", marginRight: 6 }} />
                    Statut
                </span>
            ),
            dataIndex: "statut_actuel",
            key: "statut_actuel",
            filters: [
                { text: "actif", value: "connected" },
                { text: "inactif", value: "disconnected" },
            ],
            onFilter: (value, record) => record.statut_actuel === value,
            render: (status) => {
                const isActive = status === "connected";
                return (
                    <Tag
                        icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        color={isActive ? "success" : "error"}
                        style={{ fontWeight: 500 }}
                    >
                        {isActive ? "Actif" : "Inactif"}
                    </Tag>
                );
            },
        },
    ];

    return (
        <div style={{ marginTop: '10px' }}>
            <Table 
                dataSource={capteurInfoData} 
                columns={columns} 
                rowKey={(record, index) => record.device_id || index}
                rowClassName={() => 'font-size-18'} 
                loading={loading} 
                className='table_client' 
                scroll={scroll}
                size="small"
                bordered
                locale={{ emptyText: 'Aucune donnée de capteur disponible' }}
            />
        </div>
    )
}

export default ClientVehicule