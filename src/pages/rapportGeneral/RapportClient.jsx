import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Drawer, Modal, Table, Tag, Skeleton, Input } from 'antd';
import { UserOutlined, CarryOutOutlined,CarOutlined,CalendarOutlined, DollarOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const RapportClient = () => {
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
  const [client, setClient] = useState([]);
  const scroll = { x: 400 };

  const showDrawer = (e) => {
    setOpenDetail(true);
    setIdClient(e);
  };

  const onClose = () => {
    setOpenDetail(false);
  };

 const fetchData = async (page, pageSize) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/client/client_gen`);
      setData(data);
      setLoading(false);
      setPagination((prevPagination) => ({
        ...prevPagination
      }));
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
    doc.text("Rapport client", 14, 22);
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


  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
        title: "Nbre vehicule",
        dataIndex: 'nbre_vehicule',
        key: 'nbre_vehicule',
        sorter: (a, b) => a.nbre_vehicule - b.nbre_vehicule,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <div>
            <Tag color={text > 0 ? 'green' : 'red'}><CarOutlined style={{ marginRight: "5px" }} />{text}</Tag>
          </div>
        )
    },
    {
      title: "Nbre d'année",
      dataIndex: 'nbre_annee',
      key: 'nbre_annee',
      sorter: (a, b) => a.nbre_annee - b.nbre_annee,
        sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><CalendarOutlined style={{ marginRight: "5px" }} />{text > 0 ? `${text} an(s)` : `${record.nbre_mois} mois` }</Tag>
        </div>
      )
    },
    {
      title: "Nbre facture",
      dataIndex: 'nbre_facture',
      key: 'nbre_facture',
      sorter: (a, b) => a.nbre_facture - b.nbre_facture,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <div>
          <Tag color={text > 0 ? 'green' : 'red'} ><CarryOutOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
        title: "Montant tot",
        dataIndex: 'montant_total_facture',
        key: 'montant_total_facture',
        sorter: (a, b) => a.montant_total_facture - b.montant_total_facture,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <div>
            <Tag color={text > 0 ? 'green' : 'red'}>{text}<DollarOutlined style={{ marginLeft: "5px" }} /></Tag>
          </div>
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
                <h2 className="client_h2">Rapport des clients</h2>
                <span className="client_span"></span>
              </div>
              
              <div className="client_row_number">
                <span className="client_span_title">Total : {client}</span>
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
              </Modal>

              <Modal
                title=""
                centered
                open={opens}
                onCancel={() => setOpens(false)}
                width={1000}
                footer={[]}
              >
              </Modal>

              <Drawer title="Détail" onClose={onClose} visible={openDetail} width={700}>

              </Drawer>
              
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

export default RapportClient;