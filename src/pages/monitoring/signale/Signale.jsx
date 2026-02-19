import { useCallback, useMemo, useState } from "react";
import {
  Table,
  Button,
  Dropdown,
  Input,
  Space,
  Modal,
  Typography,
  Card,
  notification,
  Empty,
  Checkbox,
  Skeleton,
  message,
} from "antd";
import {
  PrinterOutlined,
  LineChartOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Title } = Typography;

const Signale = () => {
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);

  return (
    <>
        <Card
            title={
            <Space>
                <LineChartOutlined style={{ color: "#fa541c", fontSize: 22 }} />
                <Title level={4} style={{ margin: 0 }}>
                     Rapport des connexions du jour
                </Title>
            </Space>
            }
            bordered={false}
            className="shadow-sm rounded-2xl"
            extra={
            <Space wrap>
                <Search
                placeholder="Recherche chauffeur ou véhicule..."
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
        </Card>
    </>
  )
}

export default Signale;