import React, { useState } from 'react';
import { Menu } from 'antd';
import { UserOutlined, ProjectOutlined, SettingOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './sidebar.css';
import logo from './../../assets/falcon.png';
import { Link } from 'react-router-dom';

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
        <SubMenu key="traceurs" icon={<ProjectOutlined />} title="Traceurs" style={{ fontSize: '15px'}}>
          <Item key="3">Liste des traceurs</Item>
          <Item key="4">Enregistrer un nouveau traceur</Item>
        </SubMenu>
        <SubMenu key="operations" icon={<ProjectOutlined />} title="Opérations" style={{ fontSize: '15px'}}>
          <Item key="5">Liste des opérations</Item>
          <Item key="6">Créer une opération</Item>
          <Item key="7">Type d'opérations</Item>
        </SubMenu>
        <SubMenu key="affectations" icon={<ProjectOutlined />} title="Affectations" style={{ fontSize: '15px'}}>
          <Item key="8">Liste des affectations</Item>
          <Item key="9">Créer une affectation</Item>
          <Item key="10">Liste des numéros</Item>
          <Item key="11">Enregistrer un numéro</Item>
        </SubMenu>
        <SubMenu key="settings" icon={<SettingOutlined />} title="Paramètres" style={{ fontSize: '15px'}}>
          <Item key="12">Général</Item>
          <Item key="13">Sécurité</Item>
        </SubMenu>
        <Item key="deconnecter" icon={<SettingOutlined />} style={{ fontSize: '15px'}}>
          Déconnecter
        </Item>
      </Menu>
    </div>
  );
};

export default Sidebar;