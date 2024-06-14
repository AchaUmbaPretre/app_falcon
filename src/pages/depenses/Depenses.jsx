import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Drawer, Modal, Popover, Space, Table, Tag, Input, Skeleton } from 'antd';
import {
  PlusCircleOutlined, SisternodeOutlined, EyeOutlined,
  DollarOutlined, CalendarOutlined, FilePdfOutlined,
  FileExcelOutlined, PrinterOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import moment from 'moment';
import DepenseForm from './form/DepenseForm';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Depenses = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [depenses, setDepenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const scroll = { x: 400 };

  const fetchDepenses = useCallback(async () => {
    try {
      const response = await axios.get(`${DOMAIN}/depense/depenseAll`);
      setDepenses(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchDepenses();
  }, [fetchDepenses]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/depense/${id}`);
      fetchDepenses();
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des dépenses", 14, 22);
    const tableColumn = ["#", "jour_semaine", "date_depense", "montant_dollars", "montant_franc", "total_depense"];
    const tableRows = [];

    depenses.forEach((record, index) => {
      const date = new Date(record.date_depense);
      const formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
      const tableRow = [
        index + 1,
        record.jour_semaine,
        formattedDate,
        record.montant_dollars,
        record.montant_franc,
        record.total_depense
      ];
      tableRows.push(tableRow);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('dépense.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(depenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "dépense");
    XLSX.writeFile(wb, "depenses.xlsx");
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Jour',
      dataIndex: 'jour_semaine',
      key: 'jour_semaine',
      render: (text) => (
        <Tag color="orange" icon={<CalendarOutlined />}>
          {text}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date_depense',
      key: 'date_depense',
      sorter: (a, b) => moment(a.date_depense) - moment(b.date_depense),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      )
    },
    {
        title: 'Dollars',
        dataIndex: 'montant_dollars',
        key: 'montant_dollars',
        sorter: (a, b) => a.montant_dollars - b.montant_dollars,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <Tag color={record.montant_dollars !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
            {record.montant_dollars ? record.montant_dollars + ' $' : '0'}
          </Tag>
        ),
      },
      {
        title: 'Franc',
        dataIndex: 'montant_franc',
        key: 'montant_franc',
        sorter: (a, b) => a.montant_franc - b.montant_franc,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <Tag color={record.montant_franc !== null ? 'green' : 'red'}>
            {record.montant_franc !== null ? record.montant_franc + ' fc' : '0' + ' fc'}
          </Tag>
        ),
      },
      {
        title: 'Total_depense $',
        dataIndex: 'total_depense',
        key: 'total_depense',
        sorter: (a, b) => a.total_depense - b.total_depense,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <Tag color={record.total_depense !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
            {record.total_depense ? record.total_depense + ' $' : '0' + ' $'}
          </Tag>
        ),
      },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popover title="Voir les détails" trigger="hover">
            <Link >
              <Button icon={<EyeOutlined />} style={{ color: 'blue' }} />
            </Link>
          </Popover>
        </Space>
      )
    }
  ];

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Dépense</h2>
              <span className="client_span">Liste des dépenses</span>
            </div>
            <div className="client_text_right">
              <Button onClick={openModal} icon={<PlusCircleOutlined />} />
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb separator=">" items={[{ title: 'Accueil' }, { title: 'Dépense', href: '/' }]} />
          <div className="client_wrapper_center_bottom">
            <div className="product-bottom-top">
              <div className="product-bottom-left">
              <Button icon={<SisternodeOutlined />}/>
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
            {isLoading ? (
                <Skeleton active />
            ) : (
                <Table
                dataSource={depenses}
                columns={columns}
                loading={isLoading}
                scroll={scroll}
                className='table_client'
                />
            )}

            <Modal
              title=""
              centered
              open={isModalOpen}
              onCancel={closeModal}
              width={800}
              footer={null}
            >
              <DepenseForm onClose={closeModal} />
            </Modal>
            <Drawer
              title="Détails"
              placement="right"
              onClose={closeDrawer}
              open={isDrawerOpen}
            >
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Depenses;
