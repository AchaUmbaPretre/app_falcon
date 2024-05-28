import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Drawer, Modal, Popconfirm, Popover, Space, Table, Tag } from 'antd'
import { PlusCircleOutlined, SisternodeOutlined,EyeOutlined,DeleteOutlined,InfoCircleOutlined,UserOutlined,CheckCircleOutlined,CloseCircleOutlined ,CarOutlined,BarcodeOutlined,CalendarOutlined,FilePdfOutlined,FileExcelOutlined,PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import moment from 'moment';
import { Link } from 'react-router-dom';
import TraceurForm from './form/TraceurForm';
import TraceurDetail from './detail/TraceurDetail';
import TraceurHistorique from './historique/TraceurHistorique';

const Traceur = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [idTraceur, setIdTraceur] = useState('')
  const [historiqueDetail, setHistoriqueDetail] = useState(false)
  const [historique, setHistorique] = useState('')


  const historiqueTraceur = (e) => {
    setHistoriqueDetail(true)
    setHistorique(e)
  }


  const showDrawer = (e) => {
    setOpenDetail(true);
    setIdTraceur(e)
  };

  const onClose = () => {
    setOpenDetail(false);
    setHistoriqueDetail(false);
  };

  const showModal = (e) => {
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
        await axios.delete(`${DOMAIN}/commande/commande/${id}`);
          window.location.reload();
      } catch (err) {
        console.log(err);
      }
    };


/*     useEffect(() => {
      const fetchHistorique = async () => {
        try {
          const { data } = await axios.get(`${DOMAIN}/traceur`);
          setData(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }, [DOMAIN]); */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur`);
        setIsLoading(false)
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
        <Popover content={`Voir l'historique du traceur ${record.numero_serie}`} placement="top">
          <div onClick={()=>historiqueTraceur(record.id_traceur)}>
            <Tag color={'blue'}>
              <BarcodeOutlined style={{ marginRight: "5px" }} />
              {text}
            </Tag>
        </div>
        </Popover>
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
          ) : text === 'Actif' ? (
            <Tag color={'blue'}>
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
      ),
    },
    {
      title: "Client",
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text, record) => (
        <span>
          {text ? (
            <Tag color="blue">
              <CarOutlined style={{ marginRight: "5px" }} />
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
      title: "Code",
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <span>
          {text ? (
            <Tag color="blue">
              <BarcodeOutlined style={{ marginRight: "5px" }} />
              {text}
            </Tag>
          ) : (
            <Tag color="red">
              <BarcodeOutlined style={{ marginRight: '5px' }} />
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
    },{
    title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
           <Popover  title="Voir les détails" trigger="hover">
            <Link onClick={()=>showDrawer(record.id_traceur)}>
              <Button icon={<EyeOutlined />} style={{ color: 'green' }} />
            </Link>
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

  const filteredData = data?.filter((item) => 
    item.nom_model?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.numero_serie?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_etat_traceur?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase())
  )
    
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
                <Modal
                  title=""
                  centered
                  open={open}
                  onCancel={() => setOpen(false)}
                  width={1000}
                  footer={[
                            ]}
                >
                  <TraceurForm />
                </Modal>

                <Drawer title="Détail" onClose={onClose} visible={openDetail} width={500}>
                  <TraceurDetail id_traceur ={idTraceur} />
                </Drawer>

                <Drawer title="Historique" onClose={onClose} visible={historiqueDetail} width={700}>
                  <TraceurHistorique id_traceur={historique} />
                </Drawer>
                <Table dataSource={filteredData} columns={columns} loading={isLoading} className='table_client' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Traceur