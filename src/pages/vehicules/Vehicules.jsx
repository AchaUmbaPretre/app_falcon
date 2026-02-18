import React, { useState } from 'react';
import { Breadcrumb, Button, Input, Modal, Typography, Popconfirm, Popover, Skeleton, Space, Table, Tag, message } from 'antd';
import { PlusCircleOutlined, CarOutlined, UserOutlined,BarcodeOutlined, DeleteOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import VehiculesForm from './form/VehiculesForm';
import CountUp from 'react-countup';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useVehiculeData } from './hooks/useVehiculeData';
import { useVehiculeColumns } from './hooks/useVehiculeColumns';
import { exportToExcel } from './utils/exportToExcel';
import VehiculesFormEdit from './form/VehiculesFormEdit';

const { Text } = Typography;

const Vehicules = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scroll = { x: 400 };
  const [modal, setModal] = useState({ type: null, id: null });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const { data, loading, fetchData, vehicule } = useVehiculeData({searchValue});

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

  const openModal = (type, id = null) => setModal({ type, id });
  const closeAllModals = () => setModal({ type: null, id: null });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = useVehiculeColumns({
    pagination,
    onEdit: (id) => openModal("Modify", id),
    onDetail: (id) => openModal("Detail", id),
    onDelete: handleDelete,
  });
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
              scroll={scroll}
              size="small"
              bordered
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

            <Modal
              open={modal.type === "Modify"} 
              onCancel={closeAllModals} 
              footer={null} 
              width={modal.id ? 800 : 1400} 
              centered destroyOnClose
            >
              <VehiculesFormEdit id={modal.id} onClose={closeAllModals} onSave={fetchData} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vehicules;
