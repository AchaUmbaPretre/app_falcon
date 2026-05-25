import { useEffect, useState, useMemo, useRef } from 'react';
import { Typography, Input, Tabs, Modal, Space, DatePicker, Table, Tag, notification, Spin, Progress, Tooltip } from 'antd';
import moment from 'moment';
import './signale.scss';
import { CarOutlined, DashboardOutlined, EyeOutlined, MinusCircleOutlined, InfoCircleOutlined, ToolOutlined, PlusCircleOutlined, ThunderboltOutlined, SignalFilled, NumberOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import getColumnSearchProps from '../../../utils/columnSearchUtils';
import { computeDowntimeMinutes, formatDurations } from '../../../utils/renderTooltip';
import { getConnectivity } from '../../../services/eventService.service';
import { useGroupedData } from '../../../utils/groupByPrefix';
import RapportEventDetail from '../rapportEventDetail/RapportEventDetail';
import ConnectivityMonth from '../connectivityMonth/ConnectivityMonth';
import { getDerniereOperation } from '../../../services/operation.service';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Signale = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([moment().startOf('day'), moment().endOf('day')]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [activeKey, setActiveKey] = useState('1');
  const searchInput = useRef(null);
  const [modalType, setModalType] = useState(null);
  const [idDevice, setDevice] = useState('');
  const [opera, setOpera] = useState([]);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const getTabStyle = (key) => ({
        display: 'flex',
        alignItems: 'center',
        color: activeKey === key ? '#1890ff' : 'rgba(0,0,0,0.65)',
        fontWeight: activeKey === key ? '600' : '400',
        transition: 'color 0.3s',
    });

  const iconStyle = (key) => ({
        marginRight: 8,
        fontSize: 18,
        color: activeKey === key ? '#1890ff' : 'rgba(0,0,0,0.45)',
        transform: activeKey === key ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.3s, color 0.3s',
    });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      const { data } = await getConnectivity(params);
      setReportData(data);
    } catch (err) {
      notification.error({
        message: 'Erreur de chargement',
        description: "Impossible de récupérer les données du rapport",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData()}, [dateRange]);

  const fetchDataDerniereOp = async () => {
    try {
      const { data } = await getDerniereOperation();
      setOpera(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=> {
    fetchDataDerniereOp()
  }, [])
  
  const filteredData = useMemo(() => {
    if (!searchText) return reportData;
    return reportData.filter(item =>
      item.device_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, reportData]);

    const mergedCourses = useMemo(() => {
      return filteredData.map((c) => {
        const capteur = opera.find((f) => f.id_falcon === c.device_id);
        return { ...c, capteurInfo: capteur || null };
      });
    }, [filteredData, opera]);

    const closeAllModals = () => {
        setModalType(null);
    };

    console.log(mergedCourses)

    const groupedData = useGroupedData(mergedCourses);

  const openModal = (type, idDevice = '') => {
    closeAllModals();
    setModalType(type);
    setDevice(idDevice);
  };

  const handDetails = (idDevice) => {
    openModal('detail', idDevice);
  };

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
      const pageSize = pagination.pageSize || 10;
      const pageIndex = pagination.current || 1;
      return (pageIndex - 1) * pageSize + index + 1;
    },
    width: 45,
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
    ...getColumnSearchProps(
      "device_name",
      searchText,
      setSearchText,
      "",
      searchInput
    ),
    sorter: (a, b) => a.device_name.localeCompare(b.device_name),
    render: (text) => (
      <strong>
        <CarOutlined style={{ color: "#1890ff", marginRight: 6 }} />
        {text}
      </strong>
    ),
  },
  {
    title: (
      <span style={{ color: "#8c8c8c", fontWeight: 500 }}>
        <SignalFilled style={{ color: "#722ed1", marginRight: 6 }} />
        M à j (Taux de connectivité)
      </span>
    ),
    dataIndex: "taux_connectivite_pourcent",
    key: "taux_connectivite_pourcent",
    sorter: (a, b) =>
      a.taux_connectivite_pourcent - b.taux_connectivite_pourcent,
    render: (value, record) => (
      <Tooltip title="Cliquez pour voir le détail">
        <Progress
          percent={Number(value.toFixed(2))}
          size="small"
          strokeColor={
            value >= 75 ? "#52c41a" : value >= 50 ? "#faad14" : "#f5222d"
          }
          format={(percent) => `${percent.toFixed(2)}%`}
          onClick={() => handDetails(record.device_id)}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
    ),
  },
  {
    title: (
      <span style={{ color: "#8c8c8c", fontWeight: 500 }}>
        <ClockCircleOutlined style={{ color: "#faad14", marginRight: 6 }} />
        Connexion
      </span>
    ),
    dataIndex: "derniere_connexion",
    key: "derniere_connexion",
    sorter: (a, b) =>
      computeDowntimeMinutes(a.derniere_connexion) -
      computeDowntimeMinutes(b.derniere_connexion),
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
        Statut actuel
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
  {
    title: 'Dernière Opération',
    dataIndex: 'operation',
    key: 'operation',
    render: (_, record) => {
        const operation = record.capteurInfo?.type_operations;
        
        // Définir l'icône et la couleur selon le type d'opération
        const getOperationIcon = (type) => {
            switch(type?.toLowerCase()) {
                case 'installation':
                    return { icon: <PlusCircleOutlined />, color: '#52c41a' };
                case 'maintenance':
                    return { icon: <ToolOutlined />, color: '#1890ff' };
                case 'réparation':
                case 'reparation':
                    return { icon: <ToolOutlined />, color: '#fa8c16' };
                case 'désinstallation':
                case 'desinstallation':
                    return { icon: <MinusCircleOutlined />, color: '#f5222d' };
                case 'inspection':
                    return { icon: <EyeOutlined />, color: '#722ed1' };
                default:
                    return { icon: <InfoCircleOutlined />, color: '#8c8c8c' };
            }
        };
        
        const { icon, color } = getOperationIcon(operation);
        
        if (!operation) {
            return (
                <Tag color="default" icon={<InfoCircleOutlined />}>
                    Aucune opération
                </Tag>
            );
        }
        
        return (
            <Tag color={color} icon={icon} style={{ fontWeight: 500 }}>
                {operation}
            </Tag>
        );
    }
}
];

  return (
    <>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          type="card"
          tabPosition="top"
        >
           <Tabs.TabPane
                tab={
                    <span style={getTabStyle('1')}>
                        <DashboardOutlined style={iconStyle('2')} />
                        Monitoring
                    </span>
                }
                key="1"
            >
              <div className="rapport-event-container">
                <Title level={3} style={{ marginBottom: 24 }}>
                  📊 Rapport des connexions du jour
                </Title>

                <Space
                  className="toolbar"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    marginBottom: 24,
                  }}
                >
                  <RangePicker
                    value={dateRange}
                    onChange={dates => dates && setDateRange(dates)}
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    style={{ marginBottom: 8 }}
                  />

                  <Input.Search
                    placeholder="Rechercher un véhicule"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                    style={{ width: 300, marginBottom: 8 }}
                  />
                </Space>
                <Spin spinning={loading} tip="Chargement des données...">
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
                            rowKey="device_id"
                            pagination={{ 
                              pageSize: pagination.pageSize, 
                              current: pagination.current, 
                              showSizeChanger: true 
                            }}
                            onChange={pagination => setPagination(pagination)}
                            bordered
                            size="middle"
                            scroll={{ x: 900 }}
                            loading={loading}
                          />
                        )
                    }))}
                  />
                </Spin>
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                    <span style={getTabStyle('2')}>
                        <DashboardOutlined style={iconStyle('2')} />
                        Rapport Month
                    </span>
              }
              key="2"
            >
              <ConnectivityMonth/>
            </Tabs.TabPane>
        </Tabs>
        <Modal
          title=""
          visible={modalType === 'detail'}
          onCancel={closeAllModals}
          footer={null}
          width={1200}
          centered
        >
          <RapportEventDetail idDevice={idDevice} dateRange={dateRange} />
      </Modal>
    </>
  );
};

export default Signale;