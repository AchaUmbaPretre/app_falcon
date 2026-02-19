import { Menu, Timeline } from 'antd';
import {
  HomeOutlined,
  LogoutOutlined,
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
import { getMenuIcon } from './utils/getMenuIcon';

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
    // Si aucune clé n'est ouverte, on ne fait rien
    if (keys.length === 0) {
      setOpenKeys([]);
      return;
    }
  
    if (keys.length === 1 && keys[0] === openKeys[0]) {
      return;
    }
  
    setOpenKeys(keys.length ? [keys[keys.length - 1]] : []);
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
        style={{ width: '100%', color: '#13AED8' }}
        theme="light"
      >
        <Item key="accueil" icon={<HomeOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />} style={{ fontSize: '12px', letterSpacing: '1px' }}>
          <Link to={'/'} onClick={handleLinkClick}>
            Accueil
          </Link>
        </Item>
        {data.map(menuItem => (
          <SubMenu key={menuItem.menu_id} icon={getMenuIcon(menuItem.menu_icon)} title={menuItem.menu_title} style={{ fontSize: '12px', letterSpacing: '1px' }}>
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
        <Item key="deconnecter" icon={<LogoutOutlined style={{ fontSize: '16px', color:'red' }} />} style={{ fontSize: '13px', letterSpacing: '1px' }} onClick={Logout}>
          Déconnecter
        </Item>
      </Menu>
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
