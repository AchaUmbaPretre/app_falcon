import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Modal, Popconfirm, Popover, Space, Table, Tag } from 'antd'
import { PlusCircleOutlined,EnvironmentOutlined,UserOutlined, DeleteOutlined,SisternodeOutlined,FilePdfOutlined,FileExcelOutlined,PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import SitesForm from './form/SitesForm';

const Sites = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState('');

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
        const { data } = await axios.get(`${DOMAIN}/operation/site`);
        setData(data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const rowClassName = () => {
    return 'font-size-18'; // Nom de la classe CSS personnalisée
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width:"3%"},
    {
        title: 'Nom',
        dataIndex: 'nom_client',
        key: 'nom_client',
        render : (text,record)=>(
          <div>
            <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
          </div>
        )
      },
    {
      title: 'Site',
      dataIndex: 'nom_site',
      key: 'nom_site',
      render : (text, record) => (
        <div>
          <Tag color={'volcano'}>
            <EnvironmentOutlined style={{ marginRight: "5px" }} />
            {text}
          </Tag>
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: "160px",
      render: (text, record) => (
        <Space size="middle">
{/*           <Popover  title="Voir les détails" trigger="hover">
            <Link>
              <Button icon={<EyeOutlined />} style={{ color: 'green' }} />
            </Link>
          </Popover> */}
          <Popover  title="Supprimer" trigger="hover">
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
                <h2 className="client_h2">Sites</h2>
                <span className="client_span">Liste des sites</span>
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
                  },
                  {
                    title: 'Rétourné(e)',
                    href: '/',
                  }
                ]}
            />
            <div className="client_wrapper_center_bottom">
                <div className="product-bottom-top">
                  <div className="product-bottom-left">
                    <SisternodeOutlined className='product-icon' />
                    <div className="product-row-search">
                      <SearchOutlined className='product-icon-plus'/>
                      <input type="search" name="" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}  placeholder='Recherche...' className='product-search' />
                    </div>
                  </div>
                  <div className="product-bottom-right">
                    <FilePdfOutlined className='product-icon-pdf' />
                    <FileExcelOutlined className='product-icon-excel'/>
                    <PrinterOutlined className='product-icon-printer'/>
                  </div>
                </div>

                <Table dataSource={data} columns={columns} rowClassName={rowClassName} loading={loading}  />

                <Modal
                  title=""
                  centered
                  open={open}
                  onCancel={() => setOpen(false)}
                  width={1000}
                  footer={[
                            ]}
                >
                  <SitesForm />
                </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sites