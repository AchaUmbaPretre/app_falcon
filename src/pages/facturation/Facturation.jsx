import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Drawer, Modal, Popconfirm, Popover, Space, Table, Tag, Skeleton, Input } from 'antd';
import { PlusCircleOutlined,DollarOutlined, UserOutlined, EyeOutlined, DeleteOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import FactureForm from './factureForm/FactureForm';


const Facturation = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [idClient, setIdClient] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const scroll = { x: 400 };
  const [client, setClient] = useState([]);

  const showDrawer = (e) => {
    setOpenDetail(true);
    setIdClient(e);
  };

  const onClose = () => {
    setOpenDetail(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/api/commande/commande/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

   const fetchData = async (page, pageSize) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/facture`);
      setData(data);
      setLoading(false);
      setPagination((prevPagination) => ({
        ...prevPagination
      }));
    } catch (error) {
      console.log(error);
    }
  };



   useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
    fetchData()
  }, [DOMAIN, pagination.current, pagination.pageSize, searchValue]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des factures", 14, 22);
    const tableColumn = ["#", "nom_client", "email"];
    const tableRows = [];

    data.forEach((record, index) => {
      const tableRow = [
        index + 1,
        record.nom_client
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
    XLSX.utils.book_append_sheet(wb, ws, "facture");
    XLSX.writeFile(wb, "facture.xlsx");
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Nom client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
      key: 'quantite',
      render: (text, record) => (
        <div>
          <Tag color={'green'}>{text}</Tag>
        </div>
      )
    },
    {
        title: 'Prix unitaire',
        dataIndex: 'prix_unitaire',
        key: 'prix_unitaire',
        sorter: (a, b) => a.prix_unitaire - b.prix_unitaire,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <Tag color={record.prix_unitaire !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
            {record.prix_unitaire ? record.prix_unitaire + ' $' : '0'}
          </Tag>
        ),
      },
    {
        title: 'Montant',
        dataIndex: 'montant',
        key: 'montant',
        sorter: (a, b) => a.montant - b.montant,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <Tag color={record.montant !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
            {record.montant ? record.montant + ' $' : '0'}
          </Tag>
        ),
      },
      {
        title: 'Total (Avec remise)',
        dataIndex: 'total',
        key: 'total',
        sorter: (a, b) => a.total - b.total,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <Tag color={record.total !== null ? 'green' : 'red'} icon={<DollarOutlined />}>
            {record.total ? record.total + ' $' : '0'}
          </Tag>
        ),
      },
      {
        title: 'Remise',
        dataIndex: 'description',
        key: 'description',
        render: (text, record) => (
          <div>
            <Tag color={'blue'}>{text}</Tag>
          </div>
        )
      },
      {
        title: 'Taxes',
        dataIndex: 'taxes_description',
        key: 'taxes_description',
        render: (text, record) => (
          <div>
            <Tag color={'blue'}>{text}</Tag>
          </div>
        )
      },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popover title="Voir les détails" trigger="hover">
            <Link onClick={() => showDrawer(record.id_client)}>
              <Button icon={<EyeOutlined />} style={{ color: 'green' }} />
            </Link>
          </Popover>
          <Popover title="Ajouter les contacts" trigger="hover">
            <Button icon={<PlusCircleOutlined />} onClick={() => showModalContact(record.id_client)} style={{ color: 'blue' }} />
          </Popover>
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

  const showModal = (e) => {
    setOpen(true);
  };

  const showModalContact = (e) => {
    setOpens(true);
    setIdClient(e);
  };

  const filteredData = data?.filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase())
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
              {/* <div className="client_row_number">
                <span className="client_span_title">Total : {client}</span>
              </div> */}
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

               <Modal
                title=""
                centered
                open={open}
                onCancel={() => setOpen(false)}
                width={850}
                footer={[]}
              >
                <FactureForm />
              </Modal>

{/*               <Drawer title="Détail" onClose={onClose} visible={openDetail} width={700}>
                <ClientDetail id_client={idClient} />
              </Drawer>  */}
              
              {loading ? (
                <Skeleton active />
              ) : (
                <Table
                  dataSource={filteredData}
                  columns={columns}
                  scroll={scroll}
                  className='table_client'
                  pagination={pagination}
                  onChange={handleTableChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Facturation;
