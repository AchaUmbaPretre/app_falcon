import { Menu, Timeline } from 'antd';
import {
  UserOutlined,
  ClusterOutlined,
  CarOutlined,
  FileTextOutlined,
  HourglassOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
  FileOutlined,
  HomeOutlined,
  ToolOutlined,
  SettingOutlined,
  LogoutOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sidebar.css';
import logo from './../../assets/falcon.png';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import config from '../../config';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../redux/userRedux';

const { SubMenu, Item } = Menu;

const Sidebar = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [openKeys, setOpenKeys] = useState([]);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const isSidebarOpen = useSelector((state) => state.user?.isSidebarOpen);
  const userId = useSelector((state) => state.user.currentUser.id);

  const [data, setData] = useState([]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleLinkClick = () => {
    dispatch(toggleSidebar());
  };

  const Logout = async () => {
    try {
      await axios.post(`${DOMAIN}/users/logout`);
      localStorage.removeItem('persist:root');
      toast.success('Déconnexion réussie !');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      toast.error('Erreur lors de la déconnexion.');
    }
  };

  const fetchMenu = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/menu/menuAll?userId=${userId}`);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const getMenuIcon = (icon) => {
    switch (icon) {
      case 'UserOutlined':
        return <UserOutlined style={{ fontSize: '17px' }} />;
      case 'ClusterOutlined':
        return <ClusterOutlined style={{ fontSize: '17px' }} />;
      case 'CarOutlined':
        return <CarOutlined style={{ fontSize: '17px' }} />;
      case 'FileTextOutlined':
        return <FileTextOutlined style={{ fontSize: '17px' }} />;
      case 'HourglassOutlined':
        return <HourglassOutlined style={{ fontSize: '17px' }} />;
      case 'UsergroupAddOutlined':
        return <UsergroupAddOutlined style={{ fontSize: '17px' }} />;
      case 'DollarOutlined':
        return <DollarOutlined style={{ fontSize: '17px' }} />;
      case 'FileOutlined':
        return <FileOutlined style={{ fontSize: '17px' }} />;
      case 'HomeOutlined':
        return <HomeOutlined style={{ fontSize: '17px' }} />;
      case 'ToolOutlined':
        return <ToolOutlined style={{ fontSize: '17px' }} />;
      case 'SettingOutlined':
        return <SettingOutlined style={{ fontSize: '17px' }} />;
      case 'AuditOutlined':
        return <AuditOutlined style={{ fontSize: '17px' }} />;
      default:
        return null;
    }
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'visible' : ''}`} ref={sidebarRef}>
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
        {data.map(menuItem => (
          <SubMenu key={menuItem.menu_id} icon={getMenuIcon(menuItem.menu_icon)} title={menuItem.menu_title} style={{ fontSize: '14px', letterSpacing: '1px' }}>
            {menuItem.subMenus && menuItem.subMenus.map(subMenu => (
              <Item key={subMenu.submenu_id} >
                <Link to={subMenu.submenu_url} style={{ display: 'flex', alignItems: 'center' }} onClick={handleLinkClick}>
                  <Timeline.Item dot={<span className="custom-dot" />} />
                  {subMenu.submenu_title}
                </Link>
              </Item>
            ))}
          </SubMenu>
        ))}
        <Item key="deconnecter" icon={<LogoutOutlined style={{ fontSize: '17px' }} />} style={{ fontSize: '14px', letterSpacing: '1px' }} onClick={Logout}>
          Déconnecter
        </Item>
      </Menu>
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
