import React, { useEffect, useState, useCallback } from 'react';
import {
  Breadcrumb,
  Button,
  Drawer,
  Modal,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Table,
  Tag,
  Input,
  Tabs,
  Menu,
  Dropdown
} from 'antd';
import {
  MenuOutlined,
  PlusCircleOutlined,
  SisternodeOutlined,
  DownOutlined,
  EyeOutlined,
  CloseOutlined,
  DeleteOutlined,
  CarOutlined,
  BarcodeOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import TraceurForm from './form/TraceurForm';
import TraceurDetail from './detail/TraceurDetail';
import TraceurHistorique from './historique/TraceurHistorique';
import TraceurTrie from './traceurTrie/TraceurTrie';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import TraceurDemente from './traceurEtat/TraceurDemente';
import TraceurNeuf from './traceurEtat/TraceurNeuf';
import TraceurSuspendu from './traceurEtat/TraceurSuspendu';

const Traceur = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [idTraceur, setIdTraceur] = useState('');
  const [historiqueDetail, setHistoriqueDetail] = useState(false);
  const [historique, setHistorique] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openTrie, setOpenTrie] = useState(false);
  const [traceur, setTraceur] = useState('');
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalItems, setTotalItems] = useState(0);
  const role = useSelector((state) => state.user.currentUser.role);
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'ID traceur': true,
    'Tag': true,
    "N° série": true,
    'Etat traceur': true,
    'Client': true,
    "Date d\'entrée": true
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  


  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/traceur`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          searchValue,
          page: currentPage,
          pageSize,
        },
      });
      setData(data.rows); 
      setTotalItems(data.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  }, [DOMAIN, startDate, endDate, searchValue, currentPage, pageSize]);
  

  const fetchTraceur= useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/traceur/count?searchValue=${searchValue}`);
      setTraceur(data[0]?.nbre_traceur);
    } catch (error) {
      console.log(error);
    }
  }, [DOMAIN,searchValue]);

  useEffect(() => {
    fetchData();
    fetchTraceur()
  }, [fetchData, fetchTraceur]);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    fetchData();
  };
  
  
  

  const showDrawer = (id) => {
    setIdTraceur(id);
    setOpenDetail(true);
  };

  const onClose = () => {
    setOpenDetail(false);
    setHistoriqueDetail(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/traceur/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/traceurEdit?id_traceur=${id}`);
  };


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des traceurs", 14, 22);
    const tableColumn = ["#", "nom_model", "numero_serie", "traceur_id", "code", "nom_etat_traceur", "nom_client"];
    const tableRows = [];

    data.forEach((record, index) => {
      const tableRow = [
        index + 1,
        record.nom_model,
        record.numero_serie,
        record.id_traceur,
        record.code,
        record.nom_etat_traceur,
        record.nom_client
      ];
      tableRows.push(tableRow);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('traceur.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Traceur");
    XLSX.writeFile(wb, "traceur.xlsx");
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

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 15;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "3%"
    },
    {
      title: 'ID traceur',
      dataIndex: 'traceur_id',
      key: 'traceur_id',
      render: (text) => (
        <Tag color={text ? 'blue' : 'red'}>
          {text || 'Aucun'}
        </Tag>
      ),
      ...(columnsVisibility['ID traceur'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Tag',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <Popover content={`Voir l'historique du traceur ${record.code}`} placement="top">
          <div onClick={() => setHistoriqueDetail(true) || setHistorique(record.id_traceur)}>
            <Tag color={text ? 'cyan' : 'red'}>
              <BarcodeOutlined style={{ marginRight: '5px' }} />
              {text || 'Aucun'}
            </Tag>
          </div>
        </Popover>
      ),
      ...(columnsVisibility['Tag'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Etat traceur',
      dataIndex: 'nom_etat_traceur',
      key: 'nom_etat_traceur',
      render: (text) => (
        <Tag color={text === 'Neuf' ? 'green' : text === 'Actif' ? 'blue' : 'red'}>
          {text === 'Neuf' || text === 'Actif' ? (
            <CheckCircleOutlined style={{ marginRight: '5px' }} />
          ) : (
            <CloseCircleOutlined style={{ marginRight: '5px' }} />
          )}
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Etat traceur'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color={text ? 'blue' : 'red'}>
          <CarOutlined style={{ marginRight: '5px' }} />
          {text || 'Aucun'}
        </Tag>
      ),
      ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Date d\'entrée',
      dataIndex: 'date_entree',
      key: 'date_entree',
      sorter: (a, b) => moment(a.date_entree) - moment(b.date_entree),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="gold">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      ),
      ...(columnsVisibility['Date d\'entrée'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popover title="Voir les détails" trigger="hover">
            <Link onClick={() => showDrawer(record.id_traceur)}>
              <Button icon={<EyeOutlined />} style={{ color: 'green' }} />
            </Link>
          </Popover>
          <Popover title="Modifier" trigger="hover">
            <Button icon={<EditOutlined />} style={{ color: 'geekblue' }} onClick={()=> handleEdit(record.id_traceur)} />
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

  const filteredData = data?.filter(
    (item) =>
      item.nom_model?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.nom_etat_traceur?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.nom_client?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <Tabs defaultActiveKey="0" tabBarStyle={{ background: '#f0f2f5', padding: '10px 15px' }}>
        <Tabs.TabPane tab='Traceur' key={0}>
          <div className="client">
            <div className="client_wrapper">
              <div className="client_wrapper_top">
                <div className="client_text_row">
                  <div className="client_text_left">
                    <h2 className="client_h2">Traceur</h2>
                    <span className="client_span">Liste des traceurs</span>
                  </div>
                  <div className="client_row_number">
                    {traceur ? (
                      <span className="client_span_title">Total : <CountUp end={traceur} /></span>
                    ) : (
                      <Skeleton.Input active />
                    )}
                  </div>
                  <div className="client_text_right">
                    <Button onClick={showModal} icon={<PlusCircleOutlined />} />
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
                      title: 'Traceur',
                    },
                  ]}
                />
                <div className="client_wrapper_center_bottom">
                  <div className="product-bottom-top">
                    <div className="product-bottom-left">
                      <Button
                        icon={openTrie ? <CloseOutlined /> : <SisternodeOutlined />}
                        onClick={() => setOpenTrie(!openTrie)}
                      />
                      <div className="">
                        <Input
                          type="search"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          placeholder="Recherche..."
                        />
                      </div>
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
                  {openTrie && <TraceurTrie start_date={setStartDate} end_date={setEndDate} />}
                  <Modal
                    title=""
                    centered
                    open={open}
                    onCancel={() => setOpen(false)}
                    width={1200}
                    footer={null}
                  >
                    <TraceurForm />
                  </Modal>
                  <Drawer title="Détail" onClose={onClose} visible={openDetail} width={600}>
                    <TraceurDetail id_traceur={idTraceur} />
                  </Drawer>
                  <Drawer title="Historique" onClose={onClose} visible={historiqueDetail} width={750}>
                    <TraceurHistorique id_traceur={historique} />
                  </Drawer>
                  {isLoading ? (
                    <Skeleton active />
                  ) : (
                    <Table
                      dataSource={filteredData}
                      columns={columns}
                      size="small"
                      bordered
                      pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalItems,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100','200','300','400'],
                      }}
                      onChange={handleTableChange}
                      className="table_client"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab='Démantelé' key={1}>
          <TraceurDemente />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Neuf' key={2}>
          <TraceurNeuf />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Suspendu' key={3}>
          <TraceurSuspendu />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
  
};

export default Traceur;
