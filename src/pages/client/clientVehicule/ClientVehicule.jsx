import React from 'react'
import { Typography, Tag, Table } from 'antd';
import { useClientVehicule } from './hooks/useClientVehicule'
import {
  CarOutlined,
  BarcodeOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
const { Text } = Typography;

const ClientVehicule = ({id_client}) => {
    const { data, loading } = useClientVehicule(id_client)
    const scroll = { x: 400 };

    const columns = [
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
        }
    ]

  return (
    <div style={{marginTop: '10px'}}>
        <Table 
            dataSource={data} 
            columns={columns} 
            rowClassName={() => 'font-size-18'} 
            loading={loading} 
            className='table_client' 
            scroll={scroll}
            size="small"
            bordered
        />
    </div>
  )
}

export default ClientVehicule