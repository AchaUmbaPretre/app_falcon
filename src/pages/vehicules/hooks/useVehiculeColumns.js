import { useMemo } from "react";
import { Button, Typography, Tooltip, Popconfirm, Popover, Space,  Tag } from 'antd';
import {
  CarOutlined,
  BarcodeOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";
const { Text } = Typography;

export const useVehiculeColumns = ({
  pagination,
  onEdit,
  onDetail,
  onDelete,
}) => {
    const role = useSelector((state) => state.user.currentUser.role);

    return useMemo(() => {
        const allColumns = [
            {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => {
                const pageSize = pagination.pageSize || 10;
                const pageIndex = pagination.current || 1;
                return (pageIndex - 1) * pageSize + index + 1;
            },
            width: "3%"
            },
            {
            title: 'Client',
            dataIndex: 'nom_client',
            key: 'nom_client',
            render: (text) => (
                <Text type="secondary">
                <UserOutlined style={{ marginRight: "5px" }} />
                {text}
                </Text>
            )
            },
            {
            title: 'Nom vehicule',
            dataIndex: 'nom_vehicule',
            key: 'nom_vehicule',
            render: (text) => (
                <Text type='secondary'>
                <CarOutlined style={{ marginRight: "5px" }} />
                {text || 'Aucun'}
                </Text>
            )
            },
            {
            title: 'Marque',
            dataIndex: 'nom_marque',
            key: 'nom_marque',
            render: (text) => (
                <Text type='secondary'>
                <CarOutlined style={{ marginRight: "5px" }} />
                {text}
                </Text>
            )
            },
            {
            title: 'Modéle',
            dataIndex: 'modele',
            key: 'modele',
            render: (text) => (
                <Text type='secondary'>
                <CarOutlined style={{ marginRight: "5px" }} />
                {text || 'Aucun'}
                </Text>
            )
            },
            {
            title: 'Matricule',
            dataIndex: 'matricule',
            key: 'matricule',
            render: (text) => (
                <Tag color='blue'>
                <CarOutlined style={{ marginRight: "5px" }} />
                {text}
                </Tag>
            )
            },
            {
            title: 'Tag(traceur)',
            dataIndex: 'code',
            key: 'code',
            render: (text) => (
                <Tag color={text ? 'blue' : 'red'}>
                <BarcodeOutlined style={{ marginRight: '5px' }} />
                {text || 'Aucun'}
                </Tag>
            )
            },
            role === 'admin' &&{
            title: 'Action',
            key: 'action',
            width: "50px",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Modifier">
                        <Button
                            icon={<EditOutlined />}
                            style={{ color: "green" }}
                            onClick={() => onEdit(record.id_vehicule)}
                            aria-label="Edit vehicule"
                        />
                    </Tooltip>
                    <Popover title="Supprimer" trigger="hover">
                        <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer?"
                        onConfirm={() => onDelete(record.id_vehicule)}
                        okText="Oui"
                        cancelText="Non"
                        >
                        <Button icon={<DeleteOutlined />} style={{ color: 'red' }} />
                        </Popconfirm>
                    </Popover>
                </Space>
            )
            }
        ].filter(Boolean);

        return allColumns;
    },[pagination, onEdit, onDetail, onDelete])
}