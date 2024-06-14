import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Modal, Popconfirm, Popover, Space, Table, Tag, Skeleton, Input } from 'antd'
import { PlusCircleOutlined, SisternodeOutlined, GlobalOutlined, PhoneOutlined, DeleteOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';
import NumeroForm from './form/NumeroForm';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Numero = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DOMAIN}/api/commande/commande/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/affectation/numero`);
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const getNetworkName = (phoneNumber) => {
    if (phoneNumber.startsWith('+24382') || phoneNumber.startsWith('+24383') || phoneNumber.startsWith('+24381')) {
      return { name: 'Vodacom', color: 'green' };
    } else if (phoneNumber.startsWith('+24399')) {
      return { name: 'Airtel', color: 'red' };
    } else if (phoneNumber.startsWith('+24384') || phoneNumber.startsWith('+24389')) {
      return { name: 'Orange', color: 'orange' };
    } else if (phoneNumber.startsWith('+24390')) {
      return { name: 'Africell', color: 'blue' };
    } else {
      return { name: 'Unknown', color: 'grey' };
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des numeros", 14, 22);
    const tableColumn = ["#", "Numero", "Réseau"];
    const tableRows = [];

    data.forEach((record, index) => {
      const network = getNetworkName(record.numero).name;
      const tableRow = [
        index + 1,
        record.numero,
        network
      ];
      tableRows.push(tableRow);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('numero.pdf');
  };

  const exportToExcel = () => {
    const exportData = data.map((record, index) => ({
      '#': index + 1,
      'Numero': record.numero,
      'Réseau': getNetworkName(record.numero).name
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Numero");
    XLSX.writeFile(wb, "numero.xlsx");
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Numero',
      dataIndex: 'numero',
      key: 'numero',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><PhoneOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Reseau',
      dataIndex: 'numero',
      key: 'reseau',
      render: (text, record) => {
        const { name, color } = getNetworkName(text);
        return (
          <Tag color={color}>
            <GlobalOutlined style={{ marginRight: "5px" }} />
            {name}
          </Tag>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: "160px",
      render: (text, record) => (
        <Space size="middle">
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

  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Numéro</h2>
                <span className="client_span">Liste des numéros</span>
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
                  title: 'Numéro'
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
                <NumeroForm />
              </Modal>

              {loading ? (
                <Skeleton active />
              ) : (
                <Table dataSource={data} columns={columns} loading={loading} className='table_client' />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Numero;
