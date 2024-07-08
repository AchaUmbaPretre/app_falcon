import React, { useEffect, useState, useCallback } from 'react';
import {
  Breadcrumb,
  Button,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Table,
  Tag,
  Input
} from 'antd';
import {
  PlusCircleOutlined,
  SisternodeOutlined,
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
import config from '../../../config';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import CountUp from 'react-countup';

const TraceurRapport = () => {
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
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  
  


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
      setData(data.rows); // Assurez-vous que votre backend renvoie les données sous cette forme
      setTotalItems(data.total); // Assurez-vous que votre backend renvoie le nombre total d'éléments
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
    fetchData();
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/commande/commande/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des traceurs", 14, 22);
    const tableColumn = ["#", "nom_model", "numero_serie","nom_etat_traceur", "nom_client"];
    const tableRows = [];

    data.forEach((record, index) => {
      const tableRow = [
        index + 1,
        record.nom_model,
        record.numero_serie,
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

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: '3%',
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
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      render: (text) => (
        <Tag color={text ? 'blue' : 'red'}>
          <BarcodeOutlined  style={{ marginRight: '5px' }} />
          {text || 'Aucun'}
        </Tag>
      ),
    },
    {
      title: 'Tag',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <Popover content={`Voir l'historique du traceur ${record.code}`} placement="top">
          <div onClick={() => setHistoriqueDetail(true) || setHistorique(record.id_traceur)}>
            <Tag color={text ? 'blue' : 'red'}>
              <BarcodeOutlined style={{ marginRight: '5px' }} />
              {text || 'Aucun'}
            </Tag>
          </div>
        </Popover>
      ),
    },
    {
      title: 'N° série',
      dataIndex: 'numero_serie',
      key: 'numero_serie',
      render: (text, record) => (
          <div>
            <Tag color={text ? 'blue' : 'red'}>
              <BarcodeOutlined style={{ marginRight: '5px' }} />
              {text || 'Aucun'}
            </Tag>
          </div>
      ),
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
    },
    {
      title: 'Date d\'entrée',
      dataIndex: 'date_entree',
      key: 'date_entree',
      sorter: (a, b) => moment(a.date_entree) - moment(b.date_entree),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      ),
    }
  ];

  const filteredData = data?.filter(
    (item) =>
      item.nom_model?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.nom_etat_traceur?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.nom_client?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Rapport traceur</h2>
              <span className="client_span">Liste des traceurs</span>
            </div>
            <div className="client_text_right">
              
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
                <Button onClick={exportToPDF} className="product-icon-pdf" icon={<FilePdfOutlined />} />
                <Button onClick={exportToExcel} className="product-icon-excel" icon={<FileExcelOutlined />} />
                <Button className="product-icon-printer" icon={<PrinterOutlined />} />
              </div>
            </div>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <Table
              dataSource={filteredData}
              columns={columns}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              onChange={handleTableChange}
              className="table_client"
            />
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default TraceurRapport;
