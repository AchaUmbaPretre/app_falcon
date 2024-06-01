import { Menu, Timeline } from 'antd';
import { UserOutlined, ClusterOutlined, CarOutlined,HourglassOutlined, UsergroupAddOutlined,DollarOutlined , FileOutlined, HomeOutlined, ToolOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { toast, ToastContainer } from 'react-toastify';
import './sidebar.css';
import logo from './../../assets/falcon.png';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import config from '../../config';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../redux/userRedux';

const { SubMenu, Item } = Menu;

const Sidebar = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [openKeys, setOpenKeys] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const isSidebarOpen = useSelector((state) => state.user?.isSidebarOpen);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleLinkClick = () => {
    dispatch(toggleSidebar());
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
    <div className={`sidebar ${isSidebarOpen ? 'visible' : ''}`} ref={sidebarRef} >
      <div className="sidebar_icons">
        <img src={logo} className='sidebar_img' alt="Logo" />
      </div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        className="menu-custom"
        style={{ width: '100%', backgroundColor: 'linear-gradient(180deg, #0D1B2A, #13AED8)', color: '#13AED8' }}
        theme="dark"
      >
        <Item key="accueil" icon={<HomeOutlined style={{ fontSize: '17px' }} />} style={{ fontSize: '14px', letterSpacing: '1px' }}>
          <Link to={'/'} onClick={handleLinkClick}>
            Accueil
          </Link>
        </Item>
        <SubMenu key="clients" icon={<UserOutlined style={{ fontSize: '17px' }} />} title="Clients" style={{ fontSize: '14px', letterSpacing: '1px' }}>
          <Item key="1">
            <Link to={'/client'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste des clients
            </Link>
          </Item>
          <Item key="2">
            <Link to={'/client_form'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Enregistrer un nouveau client
            </Link>
          </Item>
          <Item key="3">
            <Link to={'/sites'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />}/>
              Sites
            </Link>
          </Item>
        </SubMenu>
        <SubMenu key="traceurs" icon={<ClusterOutlined style={{ fontSize: '17px' }} />} title="Traceurs" style={{ fontSize: '14px', letterSpacing: '1px' }}>
          <Item key="4">
            <Link to={'/traceurs'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />}  />
              Liste des traceurs
            </Link>
          </Item>
          <Item key="5">
            <Link to={'/traceurs_form'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Enregistrer un nouveau traceur
            </Link>
          </Item>
        </SubMenu>
        <SubMenu key="affectations" icon={<ToolOutlined style={{ fontSize: '17px' }} />} title="Affectations" style={{ fontSize: '14px', letterSpacing: '1px' }}>
          <Item key="6">
            <Link to={'/affectation'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste d'affectations
            </Link>
          </Item>
          <Item key="7">
            <Link to={'/affectation_form'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Nouvelle affectation
            </Link>
          </Item>
          <Item key="8">
            <Link to={'/numero'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste des numéros
            </Link>
          </Item>
          <Item key="9">
            <Link to={'/numero_form'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Enregistrer un numéro
            </Link>
          </Item>
        </SubMenu>
        <SubMenu key="vehicules" icon={<CarOutlined style={{ fontSize: '17px' }} />} title="Vehicules" style={{ fontSize: '14px', letterSpacing: '1px' }}>
          <Item key="10">
            <Link to={'/vehicules'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste des vehicules
            </Link>
          </Item>
          <Item key="11">
            <Link to={'/vehicule_form'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Enregistrer un véhicule
            </Link>
          </Item>
          <Item key="12">
            <Link to={'/marques'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste des marques
            </Link>
          </Item>
          <Item key="13">
            <Link to={'/marque_form'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Enregistrer une marque
            </Link>
          </Item>
        </SubMenu>
        <SubMenu key="operations" icon={<FileOutlined style={{ fontSize: '17px' }} />} title="Opérations" style={{ fontSize: '14px', letterSpacing: '1px' }} >
          <Item key="14">
            <Link to={'/operations'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste d'opérations
            </Link>
          </Item>
          <Item key="15">
            <Link to={'/operations_form'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Enregistrer une opération
            </Link>
          </Item>
        </SubMenu>
        <SubMenu key="Recharge" icon={<HourglassOutlined style={{ fontSize: '17px' }} />} title="Recharge" style={{ fontSize: '14px', letterSpacing: '1px' }}>
          <Item key="16">
            <Link to={'/recharge_form'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Recharge
            </Link>
          </Item>
          <Item key="17">
            <Link to={'/recharge'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste de Recharges
            </Link>
          </Item>
        </SubMenu>
        <SubMenu key="Personnel" icon={<UsergroupAddOutlined style={{ fontSize: '17px' }} />} title="Personnel" style={{ fontSize: '14px', letterSpacing: '1px' }}>
          <Item key="18">
            <Link to={"/personnel"} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste du personnel
            </Link>
          </Item>
          <Item key="19">
            <Link to={"/personnel_form"} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Enregistrer un nouveau personnel
            </Link>
          </Item>
        </SubMenu>
        <SubMenu key="Paiement" icon={<DollarOutlined style={{ fontSize: '17px' }} />} title="Paiement" style={{ fontSize: '14px', letterSpacing: '1px' }}>
          <Item key="20">
            <Link to={'/paiement'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste des paiements
            </Link>
          </Item>
          <Item key="21">
            <Link to={'/dette'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste des dettes
            </Link>
          </Item>
          <Item key="22">
            <Link to={'/depense'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Liste des depenses
            </Link>
          </Item>
        </SubMenu>
        <SubMenu key="settings" icon={<SettingOutlined style={{ fontSize: '17px' }} />} title="Paramètres" style={{ fontSize: '14px', letterSpacing: '1px' }}>
          <Item key="23">
            <Link to={'/permissions'} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Permissions
            </Link>
          </Item>
          <Item key="24">
            <Link to={''} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Général
            </Link>
          </Item>
          <Item key="25">
            <Link to={''} style={{display:'flex', alignItems:'center'}} onClick={handleLinkClick}>
              <Timeline.Item dot={<span className="custom-dot" />} />
              Sécurité
            </Link>
          </Item>
        </SubMenu>
        <Item key="deconnecter" icon={<LogoutOutlined style={{ fontSize: '17px' }} />} style={{ fontSize: '14px', letterSpacing: '1px' }} onClick={Logout}>
          Déconnecter
        </Item>
      </Menu>
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
