import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  BellOutlined,
  MailOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import './topbar.scss'
import userAvatar from './../../assets/user.png'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../redux/userRedux'
import { useNavigate } from 'react-router-dom'
import config from '../../config'
import axios from 'axios'
import { toast } from 'react-toastify'

const Topbar = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.currentUser.username);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  
  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      Logout()
    } else if (key === 'settings') {
      console.log('Paramètres...')
    } else if (key === 'profile') {
      console.log('Profil utilisateur...')
    }
    setDropdownVisible(false)
  }

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

  const menu = (
    <Menu onClick={handleMenuClick} className="topbar-dropdown-menu">
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profil
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Paramètres
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Déconnexion
      </Menu.Item>
    </Menu>
  )

  return (
    <header className="topbar">
      <div className="topbar__container">
        {/* LEFT */}
        <div className="topbar__left">
          <button
            className="topbar__menu-btn"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            <MenuFoldOutlined />
          </button>
        </div>

        <div className="topbar__right">
          <div className="topbar__actions">
            <button className="topbar__icon-btn">
              <MailOutlined />
              <span className="badge">3</span>
            </button>

            <button className="topbar__icon-btn">
              <BellOutlined />
              <span className="badge">5</span>
            </button>
          </div>

          <Dropdown
            overlay={menu}
            trigger={['click']}
            visible={dropdownVisible}
            onVisibleChange={(flag) => setDropdownVisible(flag)}
          >
            <div className="topbar__user">
              <img src={userAvatar} alt="User" />
              <div className="topbar__user-info">
                <span className="name">{user}</span>
                <span className="role">Administrateur</span>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

export default Topbar
