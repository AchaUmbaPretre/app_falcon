import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Input, Skeleton, Table, Tag, Dropdown, Menu,Select } from 'antd';
import {
  SisternodeOutlined,DownOutlined, UserOutlined, CloseOutlined,
  ThunderboltOutlined, ToolOutlined, CalendarOutlined, FilePdfOutlined, FileExcelOutlined,
  PrinterOutlined, BarcodeOutlined, MenuOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import config from '../../../config';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
const { Option } = Select;

const OperationRapport = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedOperationIds, setSelectedOperationIds] = useState([]);
  const [openTrie, setOpenTrie] = useState(false);
  const scroll = { x: 400 };
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Client': true,
    'Matricule': true,
    'Tag(Traceur)': true,
    "Type d'opération": true,
    'Superviseur': true,
    'Technicien': true,
    "Date d'opération": true,
    'Crée(e) par': true,
  });
  const [dateFilter, setDateFilter] = useState('today');

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedOperationIds(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const fetchData = useCallback(async (filter) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/operation/operation_rapport`, { params: { filter } });
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [DOMAIN]);

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    fetchData(value);
  };

  useEffect(() => {
    fetchData(dateFilter);
  }, [fetchData,dateFilter]);


  const getColorForOperationType = (type) => {
    switch (type) {
      case 'Installation':
        return 'blue';
      case 'Démantèlement':
        return 'red';
      case 'Contrôle technique':
        return 'green';
      case 'Remplacement':
        return 'orange';
      default:
        return 'default';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste d'opérations", 14, 22);
    const tableColumn = ["#", "Client", "Matricule", "Tag(Traceur)", "Type d'opération", "Superviseur", "Technicien", "Date"];
    const tableRows = [];

    data.forEach((record, index) => {
      const date = new Date(record.created_at);
      const formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
      const tableRow = [
        index + 1,
        record.nom_client,
        record.matricule,
        record.code,
        record.type_operations,
        record.superviseur,
        record.technicien,
        formattedDate
      ];
      tableRows.push(tableRow);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('opérations.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Opérations");
    XLSX.writeFile(wb, "opérations.xlsx");
  };

  const toggleColumnVisibility = (columnName) => {
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

  const menu = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={() => toggleColumnVisibility(columnName)}>
            <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
            <span style={{ marginLeft: 8 }}>{columnName}</span>
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const filteredData = data?.filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_site?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.superviseur?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.type_operations?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.technicien?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.matricule.toLowerCase().includes(searchValue.toLowerCase()) 
  );

  const columns = [
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id', 
      render: (_, __, index) => index + 1, 
      width: "3%", 
      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Matricule',
      dataIndex: 'matricule',
      key: 'matricule',
      render: (text) => (
        <Tag color='volcano'>
          <BarcodeOutlined  style={{ marginRight: '5px' }} />
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Matricule'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Tag(Traceur)',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (
        <Tag color='green'>
          <BarcodeOutlined  style={{ marginRight: '5px' }} />
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Tag(Traceur)'] ? {} : { className: 'hidden-column' })
    },
    {
      title: "Type d'opération",
      dataIndex: 'type_operations',
      key: 'type_operations',
      render: (text) => (
        <Tag color={getColorForOperationType(text)}>
          <ThunderboltOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
      ...(columnsVisibility["Type d'opération"] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Superviseur',
      dataIndex: 'superviseur',
      key: 'superviseur',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Superviseur'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Technicien',
      dataIndex: 'technicien',
      key: 'technicien',
      render: (text) => (
        <Tag color='blue'>
          <ToolOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Technicien'] ? {} : { className: 'hidden-column' })
    },
    {
      title: "Date d'opération",
      dataIndex: 'date_operation',
      key: 'date_operation',
      sorter: (a, b) => moment(a.date_operation) - moment(b.date_operation),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      ),
      ...(columnsVisibility["Date d'opération"] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Crée(e) par',
      dataIndex: 'user_cr',
      key: 'user_cr',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Crée(e) par'] ? {} : { className: 'hidden-column' })
    }
  ];

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Rapport d'opérations</h2>
              <span className="client_span">Liste des opérations</span>
            </div>
            <div className="client_text_right">
              <Select value={dateFilter} onChange={handleDateFilterChange} style={{ width: 200 }}>
                <Option value="today">Aujourd'hui</Option>
                <Option value="yesterday">Hier</Option>
                <Option value="last7days">7 derniers jours</Option>
                <Option value="last30days">30 derniers jours</Option>
                <Option value="last1year">1 an</Option>
              </Select>
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb separator=">" items={[{ title: 'Accueil', href: '/' }, { title: 'Opérations' }]} />
          <div className="client_wrapper_center_bottom">
            <div className="product-bottom-top">
              <div className="product-bottom-left">
                <Button
                  icon={openTrie ? <CloseOutlined /> : <SisternodeOutlined />}
                  onClick={() => setOpenTrie(!openTrie)}
                />
                <Input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Recherche..."
                  className="product-search"
                />
              </div>
              <div className="product-bottom-right">
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                    Colonnes <DownOutlined />
                  </Button>
                </Dropdown>
                <Button onClick={exportToPDF} className="product-icon-pdf" icon={<FilePdfOutlined />} />
                <Button onClick={exportToExcel} className="product-icon-excel" icon={<FileExcelOutlined />} />
                <Button className="product-icon-printer" icon={<PrinterOutlined />} />
              </div>
            </div>
            { loading ? (
              <Skeleton active />
            ) : (
              <Table
                dataSource={filteredData}
                columns={columns}
                rowSelection={rowSelection}
                loading={loading}
                rowKey="id_operations"
                className='table_client'
                scroll={scroll}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationRapport;
