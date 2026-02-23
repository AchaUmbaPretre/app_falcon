import { useEffect, useState, useMemo, useRef } from 'react';
import { Typography, DatePicker, Tabs, Table, notification, Spin, Tag, Input, Button, Tooltip, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { CarOutlined, ArrowUpOutlined, ArrowRightOutlined, ArrowDownOutlined, SearchOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { getConnectivityMonth } from '../../../services/eventService.service';
import { useGroupedData } from '../../../utils/groupByPrefix';

const { Title } = Typography;

const ConnectivityMonth = () => {
  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const tableRef = useRef();


  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getConnectivityMonth(month);
      setData(data);
    } catch (err) {
      notification.error({
        message: 'Erreur de chargement',
        description: "Impossible de récupérer les données du rapport mensuel",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  const devices = useMemo(() => [...new Set(data.map(item => item.device_name))], [data]);
  const jours = useMemo(() => [...new Set(data.map(item => item.jour))].sort((a,b) => a-b), [data]);

  const formatDayWithMonth = (day) => {
    const monthYear = moment(month, 'YYYY-MM');
    const fullDate = monthYear.date(parseInt(day));
    return fullDate.format('MMM D');
  };

  const getScoreColor = (score) => {
    switch(score) {
      case 100: return 'green';
      case 75: return 'blue';
      case 50: return 'orange';
      case 25: return 'red';
      case 0: return 'grey';
      default: return 'default';
    }
  };

  const getScoreIcon = (score) => {
    switch(score) {
      case 100: return <ArrowUpOutlined style={{ color: 'green' }} />;
      case 75: return <ArrowRightOutlined style={{ color: 'blue' }} />;
      case 50: return <ArrowRightOutlined style={{ color: 'orange' }} />;
      case 25: return <ArrowDownOutlined style={{ color: 'red' }} />;
      case 0: return <ArrowDownOutlined style={{ color: 'grey' }} />;
      default: return null;
    }
  };

  const tableData = devices
    .filter(name => name.toLowerCase().includes(searchText.toLowerCase()))
    .map(name => {
      const row = { key: name, device_name: name };
      jours.forEach(j => {
        const match = data.find(item => item.device_name === name && item.jour === j);
        row[j] = match ? match.score_percent : null;
      });
      return row;
    });

  const columns = [
    {
      title: '#',
      render: (text, record, index) => index + 1,
      width: 10,
      fixed: 'left',
    },
    {
      title: 'Véhicule',
      dataIndex: 'device_name',
      fixed: 'left',
      width: 180,
      filterDropdown: () => (
        <Input
          placeholder="Rechercher véhicule"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 180, marginBottom: 8 }}
          prefix={<SearchOutlined />}
        />
      ),
      render: (text) => (
        <strong>
          <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
          {text}
        </strong>
      ),
    },
    ...jours.map(j => ({
      title: formatDayWithMonth(j),
      dataIndex: j,
      align: 'center',
      width: 90,
      render: (value) =>
        value !== null ? (
          <Tooltip title={`Score connectivité: ${value}%`}>
            <Tag 
              color={getScoreColor(value)} 
              style={{ fontWeight: 'bold', fontSize: 14, minWidth: 50 }}
            >
              {value}% {getScoreIcon(value)}
            </Tag>
          </Tooltip>
        ) : '-',
      sorter: (a, b) => {
        const valA = a[j] !== null ? a[j] : -1;
        const valB = b[j] !== null ? b[j] : -1;
        return valA - valB;
      },
      sortDirections: ['ascend', 'descend'],
    })),
  ];

  // 🔹 Export Excel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Connectivité");

    // Colonnes Excel
    worksheet.columns = [
      { header: '#', key: 'index', width: 5 },
      { header: 'Véhicule', key: 'device_name', width: 25 },
      ...jours.map(j => ({ header: formatDayWithMonth(j), key: j, width: 10 })),
    ];

    tableData.forEach((row, index) => {
      worksheet.addRow({
        index: index + 1,
        device_name: row.device_name,
        ...jours.reduce((acc, j) => ({ ...acc, [j]: row[j] !== null ? `${row[j]}%` : '-' }), {}),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `connectivite_${month}.xlsx`);
  };

  // 🔹 Export PDF
  const exportToPDF = () => {
    const element = tableRef.current;
    html2pdf().set({
      margin: 0.5,
      filename: `connectivite_${month}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
    }).from(element).save();
  };

  const groupedData = useGroupedData(tableData);

  return (
    <div className="rapport-event-container">
      <Title level={3} style={{ marginBottom: 24 }}>
        📅 Rapport de connectivité du mois : {moment(month, 'YYYY-MM').format('MMMM YYYY')}
      </Title>

      <Space style={{ marginBottom: 24 }}>
        <DatePicker
          picker="month"
          defaultValue={moment()}
          onChange={(date) => setMonth(date.format('YYYY-MM'))}
        />
        <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>Export Excel</Button>
        <Button icon={<FilePdfOutlined />} danger onClick={exportToPDF}>Export PDF</Button>
      </Space>

      {loading ? (
        <Spin size="large" />
      ) : (

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
      <Spin spinning={loading} tip="Chargement des données...">
        <div ref={tableRef}>
          <Table
            rowKey="id" // ⚠️ recommandé pour éviter les warnings React
            dataSource={groupedData[prefix]}
            columns={columns}
            scroll={{ x: "max-content" }}
            pagination={false}
            bordered
            size="middle"
          />
        </div>
      </Spin>
    ),
  }))}
/>
      )}
    </div>
  );
};

export default ConnectivityMonth;
