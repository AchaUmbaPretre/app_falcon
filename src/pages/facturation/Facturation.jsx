import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Modal, Popconfirm, Popover, Space, Table, Tag, Skeleton, Input, Drawer } from 'antd';
import { PlusCircleOutlined, DollarOutlined,CalendarOutlined, UserOutlined, EyeOutlined, DeleteOutlined, AuditOutlined, SearchOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import FactureForm from './factureForm/FactureForm';
import PaiementFacture from './factureForm/PaiementFacture';
import FacturationRecu from './facturationRecu/FacturationRecu';
import moment from 'moment';
import DetailFacture from './detailFactureVehicule/DetailFacture';

const Facturation = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [idFacture, setIdFacture] = useState(null);
  const [data, setData] = useState([]);
  const [idClient, setIdClient] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRecu, setOpenRecu] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0
  });
  const [factureId, setFactureId] = useState('');

  const showDrawer = (e) => {
    setOpenDetail(true);
    setFactureId(e);
    console.log(e)
  };

  const onClose = () => {
    setOpenDetail(false);
  };

  const fetchData = async (page, pageSize) => {
    try {
      const { data, headers } = await axios.get(`${DOMAIN}/facture`, {
        params: {
          page,
          pageSize,
        },
      });
      setData(data);
      setLoading(false);
      setPagination({
        ...pagination,
        total: parseInt(headers['x-total-count']),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des factures", 14, 22);
    const tableColumn = ["#", "Nom du client", "Quantite","Prix unitaire","Montant","Total (Avec remise)","Status"];
    const tableRows = [];

    data.forEach((record, index) => {
      const tableRow = [
        index + 1,
        record.nom_client,
        record.quantite,
        record.prix_unitaire,
        record.montant,
        record.total,
        record.statut
      ];
      tableRows.push(tableRow);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('facture.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Factures");
    XLSX.writeFile(wb, "facture.xlsx");
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Nom client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
      )
    },
/*     {
      title: 'Quantité',
      dataIndex: 'quantite',
      key: 'quantite',
      render: (text) => (
        <Tag color={'green'}>{text}</Tag>
      )
    }, */
/*     {
      title: 'Prix unitaire',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire',
      sorter: (a, b) => a.prix_unitaire - b.prix_unitaire,
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag color={text !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
          {text ? `${text} $` : '0'}
        </Tag>
      ),
    }, */
    {
      title: 'Montant',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag color={text !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
          {text ? `${text} $` : '0'}
        </Tag>
      ),
    },
/*     {
      title: 'Remise',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tag color={text ? 'blue' : 'red'}>{text ?? 'Aucune'}</Tag>
      )
    }, */
/*     {
      title: 'Taxes',
      dataIndex: 'taxes_description',
      key: 'taxes_description',
      render: (text) => (
        <Tag color={'blue'}>{text ?? 'Aucune'}</Tag>
      )
    }, */
    {
      title: 'Date',
      dataIndex: 'date_facture',
      key: 'date_facture',
      sorter: (a, b) => moment(a.date_facture) - moment(b.date_facture),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'statut',
      key: 'statut',
      render: (text) => (
        <Tag color={
          text === 'non payé' ? 'red' :
          text === 'payé' ? 'green' :
          text === 'partiellement payé' ? 'blue' :
          'default'
        }>
          {text}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
{/*           <Popover title="Voir les détails" trigger="hover">
            <Link>
              <Button icon={<EyeOutlined />} style={{ color: 'green' }} onClick={() => showModalRecu(record.id_facture)} />
            </Link>
          </Popover> */}
          <Popover title="Voir les détails" trigger="hover">
            <Link>
              <Button icon={<EyeOutlined />} style={{ color: 'green' }} onClick={() => showDrawer(record.id_facture)} />
            </Link>
          </Popover>
          <Popover title="Ajouter le paiement" trigger="hover">
            <Button icon={<AuditOutlined />} onClick={() => showModalPaiment(record.id_facture)} style={{ color: 'blue' }} />
          </Popover>
          <Popover title="Supprimer" trigger="hover">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer?"
              onConfirm={''}
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

  const showModalPaiment = (idFacture) => {
    setOpens(true);
/*     setIdFacture(idFacture); */
  };

  const showModalRecu = (idFacture) => {
    setOpenRecu(true);
/*     setIdFacture(idFacture); */
  };

  const filteredData = data.filter((item) =>
    item.nom_client.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Facturation</h2>
                <span className="client_span">Liste des factures</span>
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
                  title: 'Facture'
                }
              ]}
            />
            <div className="client_wrapper_center_bottom">
              <div className="product-bottom-top">
                <div className="product-bottom-left">
                  <Button icon={<SearchOutlined />} />
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

              <Modal
                title=""
                centered
                open={open}
                onCancel={() => setOpen(false)}
                width={850}
                footer={null}
              >
                <FactureForm />
              </Modal>

              <Modal
                title=""
                centered
                open={opens}
                onCancel={() => setOpens(false)}
                width={690}
                footer={null}
              >
                <PaiementFacture idFacture={idFacture} />
              </Modal>

              <Modal
                title=""
                centered
                open={openRecu}
                onCancel={() => setOpenRecu(false)}
                width={800}
                footer={null}
              >
                <FacturationRecu />
              </Modal>

              {loading ? (
                <Skeleton active />
              ) : (
                <Table
                  dataSource={filteredData}
                  columns={columns}
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                  }}
                  onChange={handleTableChange}
                />
              )}

              <Drawer title={`Détail de la facture n°${factureId}`} onClose={onClose} visible={openDetail} width={700}>
                <DetailFacture id_facture={factureId} />
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Facturation;
