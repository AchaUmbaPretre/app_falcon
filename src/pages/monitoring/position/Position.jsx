import {  useRef, useState } from "react";
import { Empty, Typography, Card, Tooltip, Space, Tag, Input, Table, Button } from 'antd';
import {
  PrinterOutlined,
  CarOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { usePositionData } from "./hooks/usePositionData";
import { usePositionColumns } from "./hooks/usePositionColumns";
const { Search } = Input;
const { Title } = Typography;

const Position = () => {
    const [falcon, setFalcon] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
    const [searchValue, setSearchValue] = useState('');
    const [modalType, setModalType] = useState(null);
    const [id, setId] = useState(null);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const closeAllModals = () => setModalType(null);
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

    const columns = usePositionColumns({
        columnsVisibility,
        pagination
    })

  return (
    <>
        <Card
            title={
            <Space>
                <CarOutlined />
                <Title level={4} style={{ margin: 0 }}>
                    Véhicules en Suivi
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
                
                <Button icon={<PrinterOutlined />}>Imprimer</Button>
            </Space>
            }
        >
        <Table
          columns={columns}
          dataSource={data}
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
          rowClassName={(record, index) => (index % 2 === 0 ? "odd-row" : "even-row")}
          locale={{
            emptyText: <Empty description="Aucune donnée disponible" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          bordered
        />
        </Card>
    </>
  )
}

export default Position