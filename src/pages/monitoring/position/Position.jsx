import { useState } from "react";
import { Typography, Dropdown, Checkbox , Card,  Tabs, Space, Input, Table, Button } from 'antd';
import {
  PrinterOutlined,
  CarOutlined,
  ReloadOutlined,
   SettingOutlined 
} from "@ant-design/icons";
import './position.scss'
import { usePositionData } from "./hooks/usePositionData";
import { usePositionColumns } from "./hooks/usePositionColumns";
import { useGroupedData } from "../../../utils/groupByPrefix";
const { Search } = Input;
const { Title } = Typography;

const Position = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
    const [searchValue, setSearchValue] = useState('');
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Immatriculation': true,
        'MAJ': true,
        'Vitesse': true,
        "Clé de contact": true,
        'Position': true,
        "Km Total": false,
        'Durée arrêt': true,
        'Direction': true
    });

    const { data, loading } = usePositionData({})
    const groupedData = useGroupedData(data);

    const columns = usePositionColumns({
        columnsVisibility,
        pagination
    })

    const columnMenu = (
        <div style={{ padding: 12, background: '#fff' }}>
            {Object.keys(columnsVisibility).map((col) => (
            <div key={col}>
                <Checkbox
                checked={columnsVisibility[col]}
                onChange={(e) =>
                    setColumnsVisibility((prev) => ({
                    ...prev,
                    [col]: e.target.checked,
                    }))
                }
                >
                {col}
                </Checkbox>
            </div>
            ))}
        </div>
    );

  return (
    <>
        <Card
            title={
            <Space>
                <CarOutlined />
                <Title level={4} style={{ margin: 0 }}>
                    Véhicules en suivi
                </Title>
            </Space>
            }
            bordered={false}
            className="shadow-sm rounded-2xl"
            extra={
            <Space wrap>
                <Search
                    placeholder="Recherche véhicule..."
                    allowClear
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ width: 260 }}
                />
                <Button icon={<ReloadOutlined />} loading={loading}>
                    Actualiser
                </Button>

                <Dropdown
                    trigger={["click"]}
                    dropdownRender={() => columnMenu}
                >
                    <Button icon={<SettingOutlined />} size="small">
                        Colonnes
                    </Button>
                </Dropdown>
                
                <Button icon={<PrinterOutlined />}>Imprimer</Button>
            </Space>
            }
        >
            <Tabs
                type="card"
                items={Object.keys(groupedData).map((prefix) => ({
                    key: prefix,
                    label: (
                    <Space size={6}>
                        <CarOutlined />
                        {prefix}
                    </Space>
                    ),
                    children: (
                    <Table
                        columns={columns}
                        dataSource={groupedData[prefix]}
                        rowKey={(record) => record.id_carburant}
                        size="middle"
                        loading={loading}
                        pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `${total} enregistrements`,
                        }}
                        onChange={(p) => setPagination(p)}
                        scroll={{ x: 1100 }}
                        bordered
                    />
                    ),
                }))}
            />
        </Card>
    </>
  )
}

export default Position