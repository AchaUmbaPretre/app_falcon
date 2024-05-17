import React, { useEffect, useState } from 'react'
import { Breadcrumb, Table, Tag } from 'antd'
import { PlusCircleOutlined, SisternodeOutlined,UserOutlined,FilePdfOutlined,FileExcelOutlined,PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';

const Personnel = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/users`);
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
      title: 'Nom',
      dataIndex: 'username',
      key: 'username',
      render : (text,record)=>(
        <div>
          <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
        title: 'Telephone',
        dataIndex: 'telephone',
        key: 'telephone',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
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
                <h2 className="client_h2">Personel</h2>
                <span className="client_span">Liste du personnel</span>
              </div>
              <div className="client_text_right">
                <button ><PlusCircleOutlined /></button>
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
                    title: 'Retourné',
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

                <Table dataSource={data} columns={columns} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Personnel