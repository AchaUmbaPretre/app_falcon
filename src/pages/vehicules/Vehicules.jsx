import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Input, Modal, Popconfirm, Popover, Skeleton, Space, Table, Tag, message } from 'antd';
import { PlusCircleOutlined, CarOutlined, UserOutlined,BarcodeOutlined, DeleteOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import VehiculesForm from './form/VehiculesForm';
import CountUp from 'react-countup';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';

const Vehicules = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicule, setVehicule] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const role = useSelector((state) => state.user.currentUser.role);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${DOMAIN}/vehicule`);
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
  }, [DOMAIN,searchValue]);

  useEffect(() => {
    fetchData();
    fetchVehicule();
  }, [fetchData, fetchVehicule, searchValue]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/api/commande/commande/${id}`);
      message.success('Véhicule supprimé avec succès');
      fetchData(); 
    } catch (err) {
      console.error(err);
      message.error('Échec de la suppression du véhicule');
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      title: 'Client',
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
      title: 'Nom vehicule',
      dataIndex: 'nom_vehicule',
      key: 'nom_vehicule',
      render: (text) => (
        <Tag color= { text ? 'blue' : 'red'}>
          <CarOutlined style={{ marginRight: "5px" }} />
          {text || 'Aucun'}
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
    role === 'admin' &&{
      title: 'Action',
      key: 'action',
      width: "160px",
      render: (_, record) => (
        <Space size="middle">
          <Popover title="Supprimer" trigger="hover">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer?"
              onConfirm={() => handleDelete(record.id_vehicule)}
              okText="Oui"
              cancelText="Non"
            >
              <Button icon={<DeleteOutlined />} style={{ color: 'red' }} />
            </Popconfirm>
          </Popover>
        </Space>
      )
    }
  ].filter(Boolean);

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

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };


  const filteredData = data?.filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.matricule?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.modele?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.code?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_vehicule?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Véhicule</h2>
              <span className="client_span">Liste des véhicules</span>
            </div>
            <div className="client_row_number">
              {vehicule ? (
                <span className="client_span_title">Total : <CountUp end={vehicule}/></span>
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
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100','200','300','400'],
              }}
              onChange={handleTableChange}
            />
            <Modal
              title=""
              centered
              open={isModalOpen}
              onCancel={handleCancel}
              width={1000}
              footer={null}
            >
              <VehiculesForm onClose={handleCancel} onSave={fetchData} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vehicules;
