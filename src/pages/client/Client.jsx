import React, { useEffect, useState } from 'react';
import './client.scss';
import { Breadcrumb, Button, Drawer, Modal, Popconfirm, Popover, Space, Table, Tag, Skeleton, Input, message } from 'antd';
import { PlusCircleOutlined, UserOutlined, FileOutlined, EyeOutlined,EditOutlined, DeleteOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import ClientForm from './form/ClientForm';
import config from '../../config';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ClientContact from './clientContact/ClientContact';
import ClientDetail from './clientDetail/ClientDetail';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getMenuPermissions } from '../../api/services/menuService';
import { useSelector } from 'react-redux';
import TarifForm from './form/tarifForm/TarifForm';


const Client = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const userId = useSelector((state) => state.user.currentUser.id);
  const role = useSelector((state) => state.user.currentUser.role);
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [openTarif, setOpenTarif] = useState(false);
  const [idClient, setIdClient] = useState([]);
  const [permission, setPermission] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const scroll = { x: 400 };
  const [client, setClient] = useState([]);
  const navigate = useNavigate();

  const showDrawer = (e) => {
    setOpenDetail(true);
    setIdClient(e);
  };

  const showDrawerTarif = (e) => {
    setOpenTarif(true);
    setIdClient(e);
  };

  const onClose = () => {
    setOpenDetail(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/client/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const getContent = (record) => (
    <div className='popOverSous' style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h4 style={{ margin: 0, marginBottom: '10px', color: '#333' }}>Détails</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
          <span style={{ fontWeight: 'bold', color: '#555', fontSize:'11px' }}>Nombre de véhicules :</span>
          <span style={{ color: '#333', fontSize:'11px' }}>{record.nbre_vehicule || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
          <span style={{ fontWeight: 'bold', color: '#555', fontSize:'11px' }}>Nombre d'opérations :</span>
          <span style={{ color: '#333', fontSize:'11px' }}>{record.nbre_operation || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
          <span style={{ fontWeight: 'bold', color: '#555', fontSize:'11px' }}>Nbre actif :</span>
          <span style={{ color: '#333', fontSize:'11px' }}> {record.nbre_actif || '0'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
          <span style={{ fontWeight: 'bold', color: '#555', fontSize:'11px' }}>Suspendu :</span>
          <span style={{ color: '#333', fontSize:'11px' }}> {record.nbre_suspendu || '0'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
          <span style={{ fontWeight: 'bold', color: '#555', fontSize:'11px' }}>Montant total de la facture :</span>
          <span style={{ color: '#333', fontSize:'11px' }}> {record.montant_total_facture || '0,00'} $</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
          <span style={{ fontWeight: 'bold', color: '#555', fontSize:'11px' }}>Montant total du paiement :</span>
          <span style={{ color: '#333', fontSize:'11px' }}> {record.montant_total_paiement || '0,00'} $</span>
        </div>
      </div>
    </div>
  );
  
useEffect(()=>{
  const fetchPermission = async () => {
    try {
      const menuPermissions = await getMenuPermissions(userId);
      setPermission(menuPermissions);

    } catch (error) {
      console.log(error);
    }
  };
  fetchPermission()

}, [DOMAIN,userId])

const fetchData = async (page, pageSize) => {
  try {
    const { data } = await axios.get(`${DOMAIN}/client`, {
      params: {
        page,
        limit: pageSize,
      },
    });
    setData(data);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};


  const fetchClient = async () => {
    try {
        const { data } = await axios.get(`${DOMAIN}/client/count?searchValue=${searchValue}`);
        setClient(data[0].nbre_client);
    } catch (error) {
        console.log(error);
    }
};

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
    fetchClient()
  }, [DOMAIN, pagination.current, pagination.pageSize, searchValue]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des clients", 14, 22);
    const tableColumn = ["#", "nom_client", "poste", "telephone", "adresse", "email"];
    const tableRows = [];

    data.forEach((record, index) => {
      const tableRow = [
        index + 1,
        record.nom_client,
        record.poste,
        record.telephone,
        record.adresse,
        record.email
      ];
      tableRows.push(tableRow);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('client.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "client");
    XLSX.writeFile(wb, "client.xlsx");
  };

  const handleEdit = (id) => {
    navigate(`/clientEdit?id_client=${id}`);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Numéro copié dans le presse-papiers');
    }).catch((err) => {
      message.error('Échec de la copie');
      console.error('Could not copy text: ', err);
    });
  };

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
      width: "3%"
    },
    {
      title: 'Nom',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text, record) => (
        <div>
          <Popover content={getContent(record)}>
            <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
          </Popover>
        </div>
      )
    },
    {
      title: 'Poste',
      dataIndex: 'poste',
      key: 'poste',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><TeamOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (text, record) => (
        <div>
          <Tag color={'green'} onClick={() => handleCopy(text)}><PhoneOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => (
        <Popover content="Cliquez pour ouvrir Gmail" trigger="hover">
          <Tag color="yellow">
            <a href={`mailto:${text}`} target="_blank" rel="noopener noreferrer">
              <MailOutlined style={{ marginRight: '5px' }} />
              {text}
            </a>
          </Tag>
        </Popover>
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
          { role === 'admin' || role === 'secretaire'}
          <Popover title="Ajouter les contacts" trigger="hover">
            <Button icon={<PlusCircleOutlined />} onClick={() => showModalContact(record.id_client)} style={{ color: 'blue' }} />
          </Popover>
          <Popover title="Ajouter les tarifs" trigger="hover">
            <Button icon={<FileOutlined />} onClick={() => showDrawerTarif(record.id_client)} style={{ color: 'blue' }} />
          </Popover>
          <Popover title="Modifier" trigger="hover">
            <Button icon={<EditOutlined />} style={{ color: 'geekblue' }} onClick={()=> handleEdit(record.id_client)} />
          </Popover>
          {
            role === 'admin' &&
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
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.poste?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.telephone?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.adresse?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Client</h2>
                <span className="client_span">Liste des clients</span>
              </div>
              <div className="client_row_number">
                <span className="client_span_title">Total : {client}</span>
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
                  title: 'Client'
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
                width={1000}
                footer={[]}
              >
                <ClientForm />
              </Modal>

              <Modal
                title=""
                centered
                open={opens}
                onCancel={() => setOpens(false)}
                width={1000}
                footer={[]}
              >
                <ClientContact id_client={idClient} />
              </Modal>

              <Modal
                title=""
                centered
                open={openTarif}
                onCancel={() => setOpenTarif(false)}
                width={500}
                footer={[]}
              >
                <TarifForm id_client={idClient} />
              </Modal>

              <Drawer title="Détail" onClose={onClose} visible={openDetail} width={700}>
                <ClientDetail id_client={idClient} />
              </Drawer>
              
              {loading ? (
                <Skeleton active />
              ) : (
                <Table
                  dataSource={filteredData}
                  columns={columns}
                  scroll={scroll}
                  size="small"
                  className='table_client'
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: client,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100', '200', '300', '400'],
                    onChange: (page, pageSize) => {
                      setPagination({ ...pagination, current: page, pageSize });
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Client;
