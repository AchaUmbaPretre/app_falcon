import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Button, Input, Modal, Popconfirm, Popover, Space, Table, Tag } from 'antd';
import { PlusCircleOutlined, CarOutlined, DeleteOutlined, SisternodeOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../../config';
import MarqueForm from './form/Marque_form';
import '../../client/form/clientForm.scss'

const Marques = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = useCallback(async (id) => {
    try {
      await axios.delete(`${DOMAIN}/vehicule/marque/${id}`);
      setData((prevData) => prevData.filter(item => item.id_marque !== id));
    } catch (err) {
      console.error(err);
    }
  }, [DOMAIN]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/vehicule/marque`);
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Marque',
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      render: (text) => (
        <Tag color="blue">
          <CarOutlined style={{ marginRight: 5 }} />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: "50px",
      render: (text, record) => (
        <Space size="middle">
          <Popover title="Supprimer" trigger="hover">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer?"
              onConfirm={() => handleDelete(record.id_marque)}
              okText="Oui"
              cancelText="Non"
            >
              <Button icon={<DeleteOutlined />} style={{ color: 'red' }} />
            </Popconfirm>
          </Popover>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setOpen(true);
  };

  const filteredData = data?.filter((item) =>
    item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Marque</h2>
              <span className="client_span">Liste des marques</span>
            </div>
            <div className="client_text_right">
              <Button icon={<PlusCircleOutlined />} onClick={showModal} />
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <Breadcrumb
            separator=">"
            items={[
              { title: 'Accueil', href: '/' },
              { title: 'Marques'},
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
                <Button  className="product-icon-pdf" icon={<FilePdfOutlined />} />
                <Button  className="product-icon-excel" icon={<FileExcelOutlined />} />
                <Button className="product-icon-printer" icon={<PrinterOutlined />} />
              </div>
            </div>
            <Table 
              dataSource={filteredData} 
              columns={columns} 
              loading={loading} 
              size="small"
              bordered
            />

            <Modal
              title=""
              centered
              open={open}
              onCancel={() => setOpen(false)}
              width={1000}
              footer={[]}
            >
              <MarqueForm/>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marques;
