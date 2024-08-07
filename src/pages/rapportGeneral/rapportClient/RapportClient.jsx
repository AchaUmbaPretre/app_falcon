import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Drawer, Modal, Popover, Space, Table, Tag, Skeleton, Input, Menu, Dropdown } from 'antd';
import { UserOutlined, CarryOutOutlined, CarOutlined, MenuOutlined, DownOutlined, EyeOutlined, CalendarOutlined, DollarOutlined, SisternodeOutlined } from '@ant-design/icons';
import config from '../../../config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RapportClientDetail from './rapportClientDetail/RapportClientDetail';

const RapportClient = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [idClient, setIdClient] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [client, setClient] = useState([]);
  const scroll = { x: 400 };
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Client': true,
    '# vehicule': true,
    "d'année": true,
    "# facture": true,
    'Montant total': true,
    'Total payé': true
  });


  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

  const menu = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={(e) => toggleColumnVisibility(columnName, e)}>
            <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
            <span style={{ marginLeft: 8 }}>{columnName}</span>
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const showDrawer = (e) => {
    setOpenDetail(true);
    setIdClient(e);
  };

  const onClose = () => {
    setOpenDetail(false);
  };

  const fetchData = async (page, pageSize) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/client/client_gen`);
      setData(data);
      setLoading(false);
      setPagination((prevPagination) => ({
        ...prevPagination
      }));
    } catch (error) {
      console.log(error);
    }
  }; 

  const fetchClient = async () => {
    try {
        const { data } = await axios.get(`${DOMAIN}/client/count?searchValue=${searchValue}`);
        setClient(data[0].nbre_client);
    } catch (error) {
        console.log(error);
    }
};

   useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
    fetchClient()
  }, [DOMAIN, pagination.current, pagination.pageSize, searchValue]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', 
      render: (text, record, index) => 
        index + 1, width: "3%",
      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text, record) => (
        <div>
          <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      ),
      ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' })
    },
    {
        title: "# vehicule",
        dataIndex: 'nbre_vehicule',
        key: 'nbre_vehicule',
        sorter: (a, b) => a.nbre_vehicule - b.nbre_vehicule,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <div>
            <Tag color={text > 0 ? 'green' : 'red'}><CarOutlined style={{ marginRight: "5px" }} />{text}</Tag>
          </div>
        ),
        ...(columnsVisibility['# vehicule'] ? {} : { className: 'hidden-column' })
    },
    {
      title: "# d'année",
      dataIndex: 'nbre_annee',
      key: 'nbre_annee',
      sorter: (a, b) => {
        const nbreA = Number(a.nbre_annee);
        const nbreB = Number(b.nbre_annee);
        return nbreA - nbreB;
      },
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <div>
          <Tag color={'blue'}>
            <CalendarOutlined style={{ marginRight: "5px" }} />
            {text > 0 ? `${text} an(s)` : `${record.nbre_mois} mois`}
          </Tag>
        </div>
      ),
      ...(columnsVisibility["# d'année"] ? {} : { className: 'hidden-column' })

    },    
    {
      title: "# facture",
      dataIndex: 'nbre_facture',
      key: 'nbre_facture',
      sorter: (a, b) => a.nbre_facture - b.nbre_facture,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <div>
          <Tag color={text > 0 ? 'green' : 'red'} ><CarryOutOutlined style={{ marginRight: "5px" }} />{text}</Tag>
        </div>
      ),
      ...(columnsVisibility['# facture'] ? {} : { className: 'hidden-column' })

    },
    {
        title: "Montant total",
        dataIndex: 'montant_total_facture',
        key: 'montant_total_facture',
        sorter: (a, b) => a.montant_total_facture - b.montant_total_facture,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => (
          <div>
            <Tag color={text > 0 ? 'green' : 'red'}>{text}<DollarOutlined style={{ marginLeft: "5px" }} /></Tag>
          </div>
        ),
        ...(columnsVisibility['Montant total'] ? {} : { className: 'hidden-column' })
    },
    {
      title: "Total payé",
      dataIndex: 'montant_total_facture',
      key: 'montant_total_facture',
      sorter: (a, b) => a.montant_total_facture - b.montant_total_facture,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <div>
          <Tag color={text > 0 ? 'green' : 'red'}>{text}<DollarOutlined style={{ marginLeft: "5px" }} /></Tag>
        </div>
      ),
      ...(columnsVisibility['Total payé'] ? {} : { className: 'hidden-column' })
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <Popover title="Voir les détails" trigger="hover">
              <Link>
                <Button icon={<EyeOutlined />} style={{ color: 'green' }} onClick={() => showDrawer(record.id_client)} />
              </Link>
            </Popover>
          </Space>
        )
      }
  ];

  const filteredData = data?.filter((item) =>
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nbre_vehicule?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nbre_annee?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nbre_facture?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <div className="client_text_row">
              <div className="client_text_left">
                <h2 className="client_h2">Rapport des clients</h2>
                <span className="client_span"></span>
              </div>
              
              <div className="client_row_number">
                <span className="client_span_title">Total : {client}</span>
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
                  title: 'Client'
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
                      className="product-search"
                    />
                  </div>
                </div>
                <div className="product-bottom-rights">
                  <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                      Colonnes <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </div>

              <Drawer title="Détail" onClose={onClose} visible={openDetail} width={800}>
                <RapportClientDetail id_client={idClient} />
              </Drawer>
              
              {loading ? (
                <Skeleton active />
              ) : (
                <Table
                  dataSource={filteredData}
                  columns={columns}
                  scroll={scroll}
                  className='table_client'
                  pagination={pagination}
                  onChange={handleTableChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RapportClient;
