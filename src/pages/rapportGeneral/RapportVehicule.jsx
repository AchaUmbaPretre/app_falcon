import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Input, Skeleton, Table, Tag, message } from 'antd';
import { CarOutlined, UserOutlined, CarryOutOutlined, CalendarOutlined, DollarOutlined, BarcodeOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import axios from 'axios';
import CountUp from 'react-countup';
import config from '../../config';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const RapportVehicule = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicule, setVehicule] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${DOMAIN}/vehicule/vehicule_gen`);
      setData(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [DOMAIN]);

  const fetchVehicule = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/vehicule/count?searchValue=${searchValue}`);
      setVehicule(data[0]?.nbre_vehicule);
    } catch (error) {
      console.log(error);
    }
  }, [DOMAIN, searchValue]);

  useEffect(() => {
    fetchData();
    fetchVehicule();
  }, [fetchData, fetchVehicule, searchValue]);

  const groupedData = data.reduce((acc, item) => {
    const clientId = item.id_client;
    if (!acc[clientId]) {
      acc[clientId] = {
        key: clientId,
        nom_client: item.nom_client,
        vehicles: []
      };
    }
    acc[clientId].vehicles.push(item);
    return acc;
  }, {});

  const expandedRowRender = (record) => {
    const columns = [
      { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
      {
        title: 'Nom véhicule',
        dataIndex: 'nom_vehicule',
        key: 'nom_vehicule',
        render: (text) => (
          <Tag color={text ? 'blue' : 'red'}>
            <CarOutlined style={{ marginRight: "5px" }} />
            {text || 'Aucun'}
          </Tag>
        )
      },
      {
        title: 'Tag(traceur)',
        dataIndex: 'code',
        key: 'code',
        render: (text) => (
          <Tag color={text ? 'blue' : 'red'}>
            <BarcodeOutlined style={{ marginRight: '5px' }} />
            {text || 'Aucun'}
          </Tag>
        )
      },
      {
        title: "Nbre de facture",
        dataIndex: 'nbre_facture',
        key: 'nbre_facture',
        sorter: (a, b) => a.nbre_facture - b.nbre_facture,
        sortDirections: ['descend', 'ascend'],
        render: (text) => (
          <div>
            <Tag color={text > 0 ? 'green' : 'red'} >
              <CarryOutOutlined style={{ marginRight: "5px" }} />{text}
            </Tag>
          </div>
        )
      },
      {
        title: 'Facture totale',
        dataIndex: 'nbre_facture_total',
        key: 'nbre_facture_total',
        render: (text) => (
          <Tag color={text > 0 ? 'green' : 'red'}>
            {text}<DollarOutlined style={{ marginLeft: "5px" }} />
          </Tag>
        )
      },
      {
        title: "Nbre de jour",
        dataIndex: 'nbre_jour',
        key: 'nbre_jour',
        render: (text) => (
          <Tag color={'blue'}>
            <CalendarOutlined style={{ marginRight: "5px" }} />{text} jour(s)
          </Tag>
        )
      },
      {
        title: "Nbre d'année ou mois",
        dataIndex: 'nbre_annee',
        key: 'nbre_annee',
        render: (text, record) => (
          <Tag color={'blue'}>
            <CalendarOutlined style={{ marginRight: "5px" }} />
            {text > 0 ? `${text} an(s)` : `${record.nbre_mois} mois` }
          </Tag>
        )
      }
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.vehicles}
        pagination={false}
        rowClassName={() => 'font-size-18'}
      />
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des véhicules", 14, 22);
    const tableColumn = ["#", "nom_client", "nom_marque", "modele", "matricule"];
    const tableRows = [];

    data.forEach((record, index) => {
      const tableRow = [
        index + 1,
        record.nom_client,
        record.nom_marque,
        record.modele,
        record.matricule
      ];
      tableRows.push(tableRow);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('vehicules.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Véhicule");
    XLSX.writeFile(wb, "vehicule.xlsx");
  };

  const filteredData = Object.values(groupedData).filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Rapport des véhicules</h2>
              <span className="client_span"></span>
            </div>
            <div className="client_row_number">
              {vehicule ? (
                <span className="client_span_title">Total : <CountUp end={vehicule} /></span>
              ) : (
                <Skeleton.Input active />
              )}
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb separator=">" items={[{ title: 'Accueil', href: '/' }, { title: 'véhicules' }]} />
          <div className="client_wrapper_center_bottom">
            <div className="product-bottom-top">
              <div className="product-bottom-left">
                <Button icon={<SisternodeOutlined />} />
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
            <Table
              dataSource={filteredData}
              columns={[
                { title: '#', dataIndex: 'key', key: 'key', render: (text, record, index) => index + 1, width: "3%" },
                {
                  title: 'Client',
                  dataIndex: 'nom_client',
                  key: 'nom_client',
                  render: (text) => (
                    <Tag color='blue'>
                      <UserOutlined style={{ marginRight: "5px" }} />
                      {text}
                    </Tag>
                  )
                }
              ]}
              expandable={{ expandedRowRender }}
              rowClassName={() => 'font-size-18'}
              loading={loading}
              className='table_client'
              pagination={{ pageSize: 15 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapportVehicule;
