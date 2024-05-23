import { Menu } from 'antd';
import { UserOutlined, ClusterOutlined, CarOutlined,UsergroupAddOutlined, FileOutlined,HomeOutlined, ToolOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'; // Ajoute les icônes appropriées
import 'antd/dist/reset.css';
import { toast, ToastContainer } from 'react-toastify';
import './sidebar.css';
import logo from './../../assets/falcon.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import config from '../../config';
import axios from 'axios';

const { SubMenu, Item } = Menu;

const Sidebar = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [openKeys, setOpenKeys] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const navigate = useNavigate();

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const Logout = async () => {
  
    try {
      await axios.post(`${DOMAIN}/users/logout`);
      setCurrentUser(null);
      localStorage.setItem('persist:root', JSON.stringify(currentUser));
      toast.success('Déconnexion réussie !');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      toast.error('Erreur lors de la déconnexion.');
    }
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
        className="menu-custom"
        style={{ width: '100%', backgroundColor: 'background: linear-gradient(180deg, #0D1B2A, #13AED8);', color: '#13AED8' }}
        theme="dark"
      >
        <Item key="accueil" icon={<HomeOutlined style={{ fontSize: '17px' }}  />} style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Link to={'/'}>
            Accueil
          </Link>
        </Item>
        <SubMenu key="clients" icon={<UserOutlined style={{ fontSize: '17px' }} />} title="Clients" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="1">
            <Link to={'/client'}>
              Liste des clients
            </Link>
          </Item>
          <Item key="2">
            <Link to={'/client_form'}>Enregistrer un nouveau client</Link>
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
            <Link to={'/operations_form'}>Enregistrer une opération</Link>
          </Item>
        </SubMenu>
        <SubMenu key="affectations" icon={<ToolOutlined style={{ fontSize: '17px' }} />} title="Affectations" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="8">
            <Link to={'/affectation'}>
              Liste d'affectations
            </Link>
          </Item>
          <Item key="9">
            <Link to={'/affectation_form'}>Nouvelle affectation</Link>
          </Item>
          <Item key="10">
            <Link to={'/numero'}>Liste des numéros</Link>
          </Item>
          <Item key="11">
            <Link to={'/numero_form'}>Enregistrer un numéro</Link>
          </Item>
        </SubMenu>
        <SubMenu key="vehicules" icon={<CarOutlined style={{ fontSize: '17px' }} />} title="Vehicules" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="12">
            <Link to={'/vehicules'}>Liste des vehicules</Link>
          </Item>
          <Item key="13">
            <Link to={'/marques'}>Liste des marques</Link>
          </Item>
          <Item key="14">
            <Link to={'/vehicule_form'}>Enregistrer un véhicule</Link>
          </Item>
        </SubMenu>
        <SubMenu key="Personnel" icon={<UsergroupAddOutlined style={{ fontSize: '17px' }} />} title="Personnel" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="15">
            <Link to={"/personnel"}>Liste du personel</Link>
          </Item>
          <Item key="16">
            <Link to={"/personnel_form"}>Enregistrer un nouveau personel</Link>
          </Item>
        </SubMenu>
        <SubMenu key="settings" icon={<SettingOutlined style={{ fontSize: '17px' }} />} title="Paramètres" style={{ fontSize: '18px', letterSpacing: '1px'}}>
          <Item key="17">Général</Item>
          <Item key="18">Sécurité</Item>
        </SubMenu>
        <Item key="deconnecter" icon={<LogoutOutlined style={{ fontSize: '17px' }} />} style={{ fontSize: '18px', letterSpacing: '1px'}} onClick={Logout}>
          Déconnecter
        </Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
