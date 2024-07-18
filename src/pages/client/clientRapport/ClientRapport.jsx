import React, { useCallback, useEffect, useState } from 'react';
import { Breadcrumb, Button, Table, Tag, Skeleton, Input, Select } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, TeamOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import config from '../../../config';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import useQuery from '../../../useQuery';

const { Option } = Select;

const ClientRapport = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const period = useQuery().get('period');
  const scroll = { x: 400 };
  const [dateFilter, setDateFilter] = useState(period);

  console.log(period)

  const fetchData = useCallback(async (filter) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/client/client_rapport`, { params: { filter } });
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchData(dateFilter);
  }, [fetchData, dateFilter]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    fetchData(value);
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


  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Nom',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
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
          <Tag color={'green'}><PhoneOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => (
        <Tag color={'gold'}>
          <MailOutlined style={{ marginRight: "5px" }} />
          {text}
        </Tag>
      )
    }
  ];


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
                <h2 className="client_h2">Rapport client</h2>
                <span className="client_span">Liste des clients</span>
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

export default ClientRapport;
