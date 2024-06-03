import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Modal, Popconfirm, Popover, Space, Table, Tag, Skeleton, DatePicker, notification } from 'antd';
import { PlusCircleOutlined, SisternodeOutlined, PhoneOutlined, BarcodeOutlined, DeleteOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import config, { userRequest } from '../../config';
import axios from 'axios';
import AffectationForm from './form/AffectationForm';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const { RangePicker } = DatePicker;

const Affectations = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, filters);
  }, [DOMAIN, pagination.current, pagination.pageSize, filters, searchValue]);

  const fetchData = async (page, pageSize, filters) => {
    setLoading(true);
    try {
      const response = await userRequest.get(`${DOMAIN}/affectation`, {
        params: { page, limit: pageSize, ...filters, search: searchValue }
      });
      const { data: records, total } = response.data;
      setData(records);
      setPagination(prev => ({ ...prev, total }));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/api/commande/commande/${id}`);
      notification.success({ message: 'Suppression réussie' });
      fetchData(pagination.current, pagination.pageSize, filters);
    } catch (err) {
      console.error(err);
      notification.error({ message: 'Échec de la suppression' });
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleDateFilterChange = (dates) => {
    setFilters(prev => ({ ...prev, dates }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste d'affectations", 14, 22);
    const tableColumn = ["#", "Numero", "Traceur"];
    const tableRows = [];

    data.forEach((record, index) => {
      const tableRow = [
        index + 1,
        record.numero,
        record.numero_serie
      ];
      tableRows.push(tableRow);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('affectations.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Affectations");
    XLSX.writeFile(wb, "affectations.xlsx");
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Numero',
      dataIndex: 'numero',
      key: 'numero',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><PhoneOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Traceur',
      dataIndex: 'numero_serie',
      key: 'numero_serie',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}>
            <BarcodeOutlined style={{ marginRight: "5px" }} />
            {text}
          </Tag>
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: "160px",
      render: (text, record) => (
        <Space size="middle">
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
        </Space>
      )
    }
  ];

  const showModal = () => {
    setOpen(true);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Affectations</h2>
                <span className="client_span">Liste d'affectations</span>
              </div>
              <div className="client_text_right">
                <button onClick={showModal}><PlusCircleOutlined /></button>
              </div>
            </div>
          </div>
          <div className="client_wrapper_center">
            <Breadcrumb
              separator=">"
              items={[
                {
                  title: 'Accueil',
                  href: '/',
                },
                {
                  title: 'Affectations',
                }
              ]}
            />
            <div className="client_wrapper_center_bottom">
              <div className="product-bottom-top">
                <div className="product-bottom-left">
                  <SisternodeOutlined className='product-icon' onClick={toggleFilters} />
                  <div className="product-row-search">
                    <SearchOutlined className='product-icon-plus' />
                    <input type="search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Recherche...' className='product-search' />
                  </div>
                </div>
                <div className="product-bottom-right">
                  <Button onClick={exportToPDF} className="product-icon-pdf" icon={<FilePdfOutlined />} />
                  <Button onClick={exportToExcel} className="product-icon-excel" icon={<FileExcelOutlined />} />
                  <Button className="product-icon-printer" icon={<PrinterOutlined />} />
                </div>
              </div>
              {showFilters && (
                <div className="filters">
                  <RangePicker onChange={handleDateFilterChange} />
                </div>
              )}
              <Modal
                title=""
                centered
                open={open}
                onCancel={() => setOpen(false)}
                width={1100}
                footer={[]}
              >
                <AffectationForm />
              </Modal>
              {loading ? (
                <Skeleton active />
              ) : (
                <Table
                  dataSource={data}
                  columns={columns}
                  className='table_client'
                  pagination={pagination}
                  onChange={handleTableChange}
                  rowKey="id" // Ajouter une clé unique pour chaque ligne
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Affectations;
