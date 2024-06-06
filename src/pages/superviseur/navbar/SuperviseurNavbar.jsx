import React, { useState } from 'react'
import { BellOutlined, PoweroffOutlined, MailOutlined } from '@ant-design/icons'
import './superviseurNavbar.scss'
import { Badge } from 'antd';
import logoIcon from './../../../assets/falcon.png'
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SuperviseurNavbar = () => {
    const navigate = useNavigate();
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [currentUser, setCurrentUser] = useState('')
    const user = useSelector((state) => state.user.currentUser.username);

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
    <>
        <div className="pageLivreurNavbar">
            <div className="pageLivreurNavbar-container">
                <nav>
                    <div className="navbar-wrapper">
                        <div className="nav-logo">
                            <img src={logoIcon} alt="" className="nav-img" onClick={()=>navigate('/')} />
                        </div>
                        <div className="navbar-right">
                            <Badge count={''}>
                                <MailOutlined className='navbar-icon' />
                            </Badge>
                            <Badge count={0}>
                                <BellOutlined className='navbar-icon'/>
                            </Badge>
                            <PoweroffOutlined className='navbar-icon' onClick={Logout}/>
                            <span className="navbar_username">{user}</span>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </>
  )
}

export default SuperviseurNavbar