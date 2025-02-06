import React, { useCallback, useEffect, useState } from 'react';
import { Breadcrumb, Button, Modal, Popconfirm, Popover, Space, Table, Tag, Skeleton, DatePicker, notification, Input } from 'antd';
import { PlusCircleOutlined, SisternodeOutlined, CloseOutlined, PhoneOutlined, BarcodeOutlined, DeleteOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';
import AffectationForm from './form/AffectationForm';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';

const { RangePicker } = DatePicker;

const Affectations = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const role = useSelector((state) => state.user.currentUser.role);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [affect, setAffect] = useState('');

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, filters, searchValue]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${DOMAIN}/affectation`, {
        params: { page: pagination.current, limit: pagination.pageSize, ...filters, search: searchValue }
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
      fetchData();
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
      render: (text) => (
        <Tag color='blue'>
          <PhoneOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Traceur',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (
        <Tag color='blue'>
          <BarcodeOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    role === 'admin' && {
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
  ].filter(Boolean);

  const fetchAffectation = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/affectation/count?searchValue=${searchValue}`);
      setAffect(data[0]?.nbre_affectation);
    } catch (error) {
      console.log(error);
    }
  }, [DOMAIN, searchValue]);

  useEffect(() => {
    fetchAffectation();
  }, [fetchAffectation]);

  const showModal = () => {
    setOpen(true);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredData = data.filter((item) =>
    item.numero?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.numero_serie?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Affectations</h2>
              <span className="client_span">Liste d'affectations</span>
            </div>
            <div className="client_row_number">
              {affect ? (
                <span className="client_span_title">Total : <CountUp end={affect} /></span>
              ) : (
                <Skeleton.Input style={{ width: 120 }} active />
              )}
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
              { title: 'Accueil', href: '/' },
              { title: 'Affectations' }
            ]}
          />
          <div className="client_wrapper_center_bottom">
            <div className="product-bottom-top">
              <div className="product-bottom-left">
                <Button
                  icon={showFilters ? <CloseOutlined /> : <SisternodeOutlined />}
                  onClick={toggleFilters}
                />
                <div className="product-row-searchs">
                  <Input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Recherche..."
                    className="product-search"
                  />
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
                dataSource={filteredData}
                columns={columns}
                className='table_client'
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="id"
                size="small"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affectations;
