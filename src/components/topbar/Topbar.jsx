import React from 'react'
import { MenuFoldOutlined, BellOutlined } from '@ant-design/icons';
import './topbar.scss'
import users from './../../assets/user.png'
import { useSelector } from 'react-redux';

const Topbar = () => {
  const user = useSelector((state) => state.user.currentUser.username);

  return (
    <>
      <div className="topbar">
        <div className="topbar-wrapper">
          <div className="topbar_left">
            <MenuFoldOutlined />
          </div>
          <div className="topbar_right">
            <div className="topbar_icons">

            </div>
            <div className="topbar_icons">
              <BellOutlined className='topbar_icon' />
            </div>
            <div className="topbar_icons">
              <img src={users} alt="" className='topbar_user'/>
              <span className='topbar_username'>{user}</span>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Topbar