import React, { useEffect, useState } from 'react'
import { Breadcrumb, Table, Tag } from 'antd'
import { PlusCircleOutlined, SisternodeOutlined,InfoCircleOutlined,UserOutlined,CheckCircleOutlined,CloseCircleOutlined ,CarOutlined,BarcodeOutlined,CalendarOutlined,FilePdfOutlined,FileExcelOutlined,PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import moment from 'moment';

const Traceur = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);


  const rowClassName = () => {
    return 'font-size-18'; // Nom de la classe CSS personnalisée
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur`);
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
      dataIndex: 'nom_model',
      key: 'model',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}>
            <CarOutlined style={{ marginRight: "5px" }} />
            {text}
          </Tag>
        </div>
      )
    },
    {
      title: 'Numero série',
      dataIndex: 'numero_serie',
      key: 'numero_serie',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}>
            <BarcodeOutlined style={{ marginRight: "5px" }} />
            {text}
          </Tag>
        </div>
      )
    },
    {
      title: 'Etat traceur',
      dataIndex: 'nom_etat_traceur',
      key: 'nom_etat_traceur',
      render: (text, record) => (
        <div>
          {text === 'Neuf' ? (
            <Tag color={'green'}>
              <CheckCircleOutlined style={{ marginRight: "5px" }} />
              {text}
            </Tag>
          ) : (
            <Tag color={'red'}>
              <CloseCircleOutlined style={{ marginRight: "5px" }} />
              {text}
            </Tag>
          )}
        </div>
      )
    },
    {
      title: "Client",
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text, record) => (
        <span>
          {text ? (
            <Tag color="blue">
              {text}
            </Tag>
          ) : (
            <Tag color="red">
              <UserOutlined style={{ marginRight: '5px' }} />
              Aucun
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "Date d'entrée",
      dataIndex: 'date_entree',
      key: 'date_entree',
      sorter: (a, b) => moment(a.date_entree) - moment(b.date_entree),
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-yyyy')}
              </Tag>
            ),
    },
    {
    title: "Observation",
    dataIndex: 'observation',
    key: 'observation',
    render: (text, record) => (
      <span>
        {text ? (
          <Tag color='blue'><InfoCircleOutlined style={{ marginRight: '5px' }} /> {text}</Tag>
        ) : (
          <Tag color='red'>
            <InfoCircleOutlined style={{ marginRight: '5px' }} />
            Aucune
          </Tag>
        )}
      </span>
    ),
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

                <Table dataSource={data} columns={columns} rowClassName={rowClassName} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Traceur