import { Menu } from 'antd';
import { UserOutlined, ClusterOutlined, CarOutlined,UsergroupAddOutlined, FileOutlined,HomeOutlined, ToolOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'; // Ajoute les icônes appropriées
import 'antd/dist/reset.css';
import './sidebar.css';
import logo from './../../assets/falcon.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const { SubMenu, Item } = Menu;

const Sidebar = () => {
  const [openKeys, setOpenKeys] = useState([]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div className="sidebar">
      <div className="sidebar_icons">
        <img src={logo} className='sidebar_img' alt="Logo" />
      </div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{ width: '100%', backgroundColor: '#0D1B2A', color: '#13AED8' }}
        theme="dark"
      >
        <Item key="accueil" icon={<HomeOutlined style={{ fontSize: '17px' }}  />} style={{ fontSize: '18px', letterSpacing: '1px'}}>
          Accueil
        </Item>
        <SubMenu key="clients" icon={<UserOutlined style={{ fontSize: '17px' }} />} title="Clients" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="1">
            <Link to={'/client'}>
              Liste des clients
            </Link>
          </Item>
          <Item key="2">
            <Link to={'/client_form'}>Créer un nouveau client</Link>
          </Item>
        </SubMenu>
        <SubMenu key="traceurs" icon={<ClusterOutlined style={{ fontSize: '17px' }} />} title="Traceurs" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="3">
            <Link to={'/traceurs'}>Liste des traceurs</Link>
          </Item>
          <Item key="4">
            <Link to={'/traceurs_form'}>Enregistrer un nouveau traceur</Link>
          </Item>
        </SubMenu>
        <SubMenu key="operations" icon={<FileOutlined style={{ fontSize: '17px' }} />} title="Opérations" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="5">
            <Link to={'/operations'}>Liste d'opérations</Link>
          </Item>
          <Item key="6">
          <Link to={'/operations_form'}>Créer une opération</Link>
          </Item>
          <Item key="7">Type d'opérations</Item>
        </SubMenu>
        <SubMenu key="affectations" icon={<ToolOutlined style={{ fontSize: '17px' }} />} title="Affectations" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="8">Liste d'affectations</Item>
          <Item key="9">Créer une affectation</Item>
          <Item key="10">Liste des numéros</Item>
          <Item key="11">Enregistrer un numéro</Item>
        </SubMenu>
        <SubMenu key="vehicules" icon={<CarOutlined style={{ fontSize: '17px' }} />} title="Vehicules" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="12">Liste des vehicules</Item>
          <Item key="13">Enregistrer un vehicule</Item>
        </SubMenu>
        <SubMenu key="Personnel" icon={<UsergroupAddOutlined style={{ fontSize: '17px' }} />} title="Personnel" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="14">Liste des personels</Item>
        </SubMenu>
        <SubMenu key="settings" icon={<SettingOutlined style={{ fontSize: '17px' }} />} title="Paramètres" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="15">Général</Item>
          <Item key="16">Sécurité</Item>
        </SubMenu>
        <Item key="deconnecter" icon={<LogoutOutlined style={{ fontSize: '17px' }} />} style={{ fontSize: '18px', letterSpacing: '1px'}}>
          Déconnecter
        </Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
