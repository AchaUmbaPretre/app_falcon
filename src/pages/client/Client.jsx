import React, { useState } from 'react'
import './client.scss'
import { Breadcrumb, Modal, Table } from 'antd'
import { PlusCircleOutlined, SisternodeOutlined,FilePdfOutlined,FileExcelOutlined,PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import ClientForm from './form/ClientForm';

const Client = () => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);

  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width:"3%"},
    {
      title: 'Nom',
      dataIndex: 'nom_client',
      key: 'nom_client',
    },
    {
      title: 'Nom principal',
      dataIndex: 'nom_principal',
      key: 'nom_principal',
    },
    {
      title: 'Poste',
      dataIndex: 'poste',
      key: 'poste',
    },
    {
      title: 'Poste',
      dataIndex: 'poste',
      key: 'poste',
    },
    {
      title: 'Telephone',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
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
                <h2 className="client_h2">Client</h2>
                <span className="client_span">Liste des clients</span>
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

                <Modal
                  title=""
                  centered
                  open={open}
                  onCancel={() => setOpen(false)}
                  width={1000}
                  footer={[
                            ]}
                >
                  <ClientForm />
                </Modal>

                <Table dataSource={dataSource} columns={columns} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Client