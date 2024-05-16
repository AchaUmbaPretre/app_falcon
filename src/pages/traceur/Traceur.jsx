import React, { useEffect, useState } from 'react'
import { Breadcrumb, Table } from 'antd'
import { PlusCircleOutlined, SisternodeOutlined,FilePdfOutlined,FileExcelOutlined,PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';

const Traceur = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur/traceur_etat`);
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width:"3%"},
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Commentaire',
      dataIndex: 'commentaire',
      key: 'commentaire',
    },
    {
      title: 'Superviseur',
      dataIndex: 'superviseur',
      key: 'superviseur',
    },
    {
      title: "Client",
      dataIndex: 'nom_client',
      key: 'nom_client'
    },
    {
      title: "Numero de serie",
      dataIndex: 'numero_serie',
      key: 'numero_serie'
    },
    {
      title: "Date d'entrée",
      dataIndex: 'numero_serie',
      key: 'numero_serie'
    },
    {
      title: "Observation",
      dataIndex: 'observation',
      key: 'observation'
    }
  ];
    
  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Traceur</h2>
                <span className="client_span">Liste des traceurs</span>
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

export default Traceur