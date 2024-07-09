import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Input, Table, Tag, message, Select } from 'antd';
import { CarOutlined, UserOutlined,BarcodeOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../../config';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const { Option } = Select;


const VehiculeRapport = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');


  const fetchData = useCallback(async (filter) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/vehicule/vehicule_rapport`, { params: { filter } });
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [DOMAIN]);

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    fetchData(value);
  };


  useEffect(() => {
    fetchData(dateFilter);
  }, [fetchData, dateFilter]);


  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Nom',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag color='blue'>
          <UserOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Marque',
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      render: (text) => (
        <Tag color='blue'>
          <CarOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    },
    {
      title: 'Modéle',
      dataIndex: 'modele',
      key: 'modele',
      render: (text) => (
        <Tag color={text ? 'blue' : 'red'}>
          <CarOutlined style={{ marginRight: "5px" }} />
          {text || 'Aucun'}
        </Tag>
      )
    },
    {
      title: 'Matricule',
      dataIndex: 'matricule',
      key: 'matricule',
      render: (text) => (
        <Tag color='blue'>
          <CarOutlined style={{ marginRight: "5px" }} />
          {text}
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
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des vehicules", 14, 22);
    const tableColumn = ["#", "nom_client", "nom_marque","modele","matricule"];
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
    XLSX.utils.book_append_sheet(wb, ws, "Vehicule");
    XLSX.writeFile(wb, "vehicule.xlsx");
  };

  const filteredData = data?.filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.matricule?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.modele?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.code?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Rapport véhicule</h2>
              <span className="client_span">Liste des véhicules</span>
            </div>
            <div className="client_text_right">
              <Select value={dateFilter} onChange={handleDateFilterChange} style={{ width: 200 }}>
                <Option value="today">Aujourd'hui</Option>
                <Option value="yesterday">Hier</Option>
                <Option value="last7days">7 derniers jours</Option>
                <Option value="last30days">30 derniers jours</Option>
                <Option value="last1year">1 an</Option>
              </Select>
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb separator=">" items={[{ title: 'Accueil', href: '/' },{ title: 'vehicules' }]} />
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
            <Table 
              dataSource={filteredData} 
              columns={columns} 
              rowClassName={() => 'font-size-18'} 
              loading={loading} 
              className='table_client' 
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehiculeRapport;
