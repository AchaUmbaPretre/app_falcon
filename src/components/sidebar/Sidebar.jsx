import { Menu } from 'antd';
import { UserOutlined, ClusterOutlined, FileOutlined, ToolOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'; // Ajoute les icônes appropriées
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
        <SubMenu key="clients" icon={<UserOutlined />} title="Clients" style={{ fontSize: '15px'}}>
          <Item key="1">
            <Link to={'/client'}>
              Liste des clients
            </Link>
          </Item>
          <Item key="2">Créer un nouveau client</Item>
        </SubMenu>
        <SubMenu key="traceurs" icon={<ClusterOutlined />} title="Traceurs" style={{ fontSize: '15px'}}>
          <Item key="3">Liste des traceurs</Item>
          <Item key="4">Enregistrer un nouveau traceur</Item>
        </SubMenu>
        <SubMenu key="operations" icon={<FileOutlined />} title="Opérations" style={{ fontSize: '15px'}}>
          <Item key="5">
            <Link to={'/operations'}>Liste des opérations</Link>
          </Item>
          <Item key="6">Créer une opération</Item>
          <Item key="7">Type d'opérations</Item>
        </SubMenu>
        <SubMenu key="affectations" icon={<ToolOutlined />} title="Affectations" style={{ fontSize: '15px'}}>
          <Item key="8">Liste des affectations</Item>
          <Item key="9">Créer une affectation</Item>
          <Item key="10">Liste des numéros</Item>
          <Item key="11">Enregistrer un numéro</Item>
        </SubMenu>
        <SubMenu key="settings" icon={<SettingOutlined />} title="Paramètres" style={{ fontSize: '15px'}}>
          <Item key="12">Général</Item>
          <Item key="13">Sécurité</Item>
        </SubMenu>
        <Item key="deconnecter" icon={<LogoutOutlined />} style={{ fontSize: '15px'}}>
          Déconnecter
        </Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
