import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Drawer, Modal, Popconfirm, Popover, Space, Table, Tag, Input, Skeleton } from 'antd';
import {
  PlusCircleOutlined, CreditCardOutlined, DeleteOutlined, SisternodeOutlined,
  UserOutlined, DollarOutlined, CalendarOutlined, EyeOutlined, FilePdfOutlined,
  FileExcelOutlined, PrinterOutlined
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import moment from 'moment';
import PaiementForm from './form/PaiementForm';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';
import PaiementDetail from './PaiementDetail';

const Paiement = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const scroll = { x: 400 };
  const [idPaiement, setIdPaiement] = useState(''); 

  const fetchPaiements = useCallback(async () => {
    try {
      const response = await axios.get(`${DOMAIN}/paiement`);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchPaiements();
  }, [fetchPaiements]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/paiement/${id}`);
      fetchPaiements();
    } catch (err) {
      console.error(err);
    }
  };

  const showDrawer = (id) => {
    setOpenDetail(true);
    setIdPaiement(id);
  };

  const showModal = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpenDetail(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des clients", 14, 22);
    const tableColumn = ["#", "Code", "nom_client", "Montant", "Montant_tva", "Date", "Methode"];
    const tableRows = [];

    data.forEach((record, index) => {
      const tableRow = [
        index + 1,
        record.ref,
        record.nom_client,
        record.montant,
        record.montant_tva,
        record.date_paiement,
        record.nom_methode
      ];
      tableRows.push(tableRow);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('paiement.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "paiement");
    XLSX.writeFile(wb, "paiement.xlsx");
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Code',
      dataIndex: 'ref',
      key: 'ref',
      render: (text) => (
        <Tag color='blue'>
          {text}
        </Tag>
      )
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: '5px' }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      sorter: (a, b) => a.montant - b.montant,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <Tag color={text !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
          {text ? `${text} $` : '0'}
        </Tag>
      )
    },
/*     {
      title: 'Montant (TVA)',
      dataIndex: 'montant_tva',
      key: 'montant_tva',
      render: (text, record) => (
        <Tag color='green'>
          <DollarOutlined style={{ marginRight: '5px' }} />
          {text} $
        </Tag>
      )
    }, */
    {
      title: "Date",
      dataIndex: 'date_paiement',
      key: 'date_paiement',
      sorter: (a, b) => moment(a.date_paiement) - moment(b.date_paiement),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      )
    },
    {
      title: "Methode",
      dataIndex: 'nom_methode',
      key: 'nom_methode',
      render: (text) => (
        <Tag color="orange">
          <CreditCardOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Effectué par',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: '5px' }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popover title="Voir les détails" trigger="hover">
            <Link onClick={() => showDrawer(record.id_paiement)}>
              <Button icon={<EyeOutlined />} style={{ color: 'blue' }} />
            </Link>
          </Popover>
          <Popover title="Supprimer" trigger="hover">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer?"
              onConfirm={() => handleDelete(record.id_paiement)}
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

  const filteredData = data?.filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.device?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Paiement</h2>
                <span className="client_span">Liste des paiements</span>
              </div>
              <div className="client_text_right">
                <Button onClick={showModal} icon={<PlusCircleOutlined />} />
              </div>
            </div>
          </div>
          <div className="client_wrapper_center">
            <Breadcrumb separator=">" items={[{ title: 'Accueil', href: '/' }, { title: 'Paiement' }]} />
            <div className="client_wrapper_center_bottom">
              <div className="product-bottom-top">
                <div className="product-bottom-left">
                  <Button icon={<SisternodeOutlined />} />
                  <Input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Recherche..."
                    className="product-search"
                  />
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
                <Table dataSource={filteredData} columns={columns} loading={isLoading} scroll={scroll} className='table_client' />
              )}
              <Modal
                title=""
                centered
                open={open}
                onCancel={() => setOpen(false)}
                width={800}
                footer={null}
              >
                <PaiementForm />
              </Modal>
              <Drawer
                title="Détails"
                placement="right"
                onClose={onClose}
                open={openDetail}
                width={750}
              >
                <PaiementDetail id_paiement={idPaiement} />
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Paiement;
