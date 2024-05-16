import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Popconfirm, Popover, Space, Table, Tag } from 'antd'
import { PlusCircleOutlined, SisternodeOutlined,DeleteOutlined,EyeOutlined,EnvironmentOutlined,CalendarOutlined ,FilePdfOutlined,FileExcelOutlined,PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Operations = () => {
 const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
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
        const { data } = await axios.get(`${DOMAIN}/operation`);
        setData(data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width:"3%"},
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
    },
    {
        title: 'Site',
        dataIndex: 'site',
        key: 'site',
        render: (text, record) => (
          <Tag color={'blue'}>
            <EnvironmentOutlined style={{ marginRight: "5px" }} />
            {text}
          </Tag>
        )
      },
    {
      title: 'Superviseur',
      dataIndex: 'superviseur',
      key: 'superviseur',
    },
    {
      title: "Date d'opération",
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => moment(a.created_at) - moment(b.created_at),
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-yyyy')}
              </Tag>
            ),
    },
    {
        title: 'Action',
          key: 'action',
          render: (text, record) => (
            <Space size="middle">
              <Popover  title="Voir les détails" trigger="hover">
                <Link>
                  <Button icon={<EyeOutlined />} style={{ color: 'green' }} />
                </Link>
              </Popover>
              <Popover  title="Ajoutez les contacts" trigger="hover">
                <Button icon={<PlusCircleOutlined />} style={{ color: 'blue' }} />
              </Popover>
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
    
  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Opérations</h2>
                <span className="client_span">Liste des opérations</span>
              </div>
              <div className="client_text_right">
                <button><PlusCircleOutlined /></button>
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
                    title: 'Application Center',
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

                <Table dataSource={data} columns={columns} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Operations