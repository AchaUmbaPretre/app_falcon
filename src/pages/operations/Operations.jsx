import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Drawer, Input, Modal, Popconfirm, Popover, Skeleton, Space, Table, Tag, Dropdown, Menu } from 'antd';
import {
  PlusCircleOutlined, SisternodeOutlined,DownOutlined, UserOutlined, CloseOutlined,
  ThunderboltOutlined, ToolOutlined, DeleteOutlined, EyeOutlined, CalendarOutlined, FilePdfOutlined, FileExcelOutlined,
  PrinterOutlined, BarcodeOutlined, MenuOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import config from '../../config';
import OperationGen from './form/OperationGen';
import OperationTrier from './operationTrier/OperationTrier';
import OperationTableau from './operationDetail/OperationTableau';
import CountUp from 'react-countup';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';

const Operations = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const role = useSelector((state) => state.user.currentUser.role);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedOperationIds, setSelectedOperationIds] = useState([]);
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [openTrie, setOpenTrie] = useState(false);
  const scroll = { x: 400 };
  const [operation, setOperation] = useState(null);
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

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedOperationIds(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const fetchOperations = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${DOMAIN}/operation`, {
        params: {
          start_date,
          end_date,
          searchValue,
        },
      });
      setData(data);
    } catch (error) {
      console.error('Failed to fetch operations:', error);
    } finally {
      setLoading(false);
    }
  }, [DOMAIN, start_date, end_date, searchValue]);

  const fetchNbreOperation = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/operation/count?searchValue=${searchValue}`);
      setOperation(data[0].nbre_operation);
    } catch (error) {
      console.log(error);
    }
  }, [DOMAIN, searchValue]);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  useEffect(() => {
    fetchNbreOperation()
  }, [fetchNbreOperation]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/api/commande/commande/${id}`);
      fetchOperations();
    } catch (error) {
      console.error('Failed to delete operation:', error);
    }
  };

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

  const showDrawer = () => {
    setOpenDetail(true);
  };

  const closeDrawer = () => {
    setOpenDetail(false);
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
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

  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

  const menu = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
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
    item.matricule?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.code?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
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
      title: 'Nomenclature',
      dataIndex: 'nomenclature',
      key: 'nomenclature',
      render: (text) => (
        <Tag color='green'>
          <BarcodeOutlined  style={{ marginRight: '5px' }} />
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Tag(Traceur)'] ? {} : { className: 'hidden-column' })
    },
    {
      title: "Opération",
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
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popover title="Voir les détails" trigger="hover">
            <Button icon={<EyeOutlined />} style={{ color: 'green' }} onClick={showDrawer} disabled={selectedRowKeys.length === 0} />
          </Popover>
          {role === 'admin' &&
            <Popover title="Supprimer" trigger="hover">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer?"
                onConfirm={() => handleDelete(record.id_client)}
                okText="Oui"
                cancelText="Non"
              >
                <Button icon={<DeleteOutlined />} style={{ color: 'red' }} />
              </Popconfirm>
          </Popover>
          }
        </Space>
      ),
    },
  ];

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Opérations</h2>
              <span className="client_span">Liste des opérations</span>
            </div>
            <div className="client_row_number">
                {operation !== null ? (
                  <span className="client_span_title">Total : <CountUp end={operation} /></span>
                ) : (
                  <Skeleton.Input style={{ width: 120 }} active />
                )}
            </div>
            <div className="client_text_right">
              <Button icon={<PlusCircleOutlined />} onClick={() => setOpen(true)} />
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
              <div className="product-bottom-rights">
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                    Colonnes <DownOutlined />
                  </Button>
                </Dropdown>
                {/* <Button onClick={exportToPDF} className="product-icon-pdf" icon={<FilePdfOutlined />} />
                <Button onClick={exportToExcel} className="product-icon-excel" icon={<FileExcelOutlined />} />
                <Button className="product-icon-printer" icon={<PrinterOutlined />} /> */}
              </div>
            </div>
            {openTrie && (
              <OperationTrier getProduits={setData} start_date={setStartDate} end_date={setEndDate} />
            )}
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
                pagination={pagination}
                scroll={scroll}
                onChange={handleTableChange}
              />
            )}

            <Modal
              title=""
              centered
              visible={open}
              onCancel={() => setOpen(false)}
              width={700}
              footer={null}
            >
              <OperationGen />
            </Modal>
            <Drawer
              title="Détail"
              onClose={closeDrawer}
              visible={openDetail}
              width={800}
            >
              <OperationTableau selectedOperations={selectedOperationIds} />
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operations;
