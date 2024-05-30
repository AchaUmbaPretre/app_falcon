import React from 'react'
import { MenuFoldOutlined, BellOutlined, MailOutlined } from '@ant-design/icons';
import './topbar.scss'
import users from './../../assets/user.png'
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../redux/userRedux';

const Topbar = () => {
  const user = useSelector((state) => state.user.currentUser.username);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-wrapper">
          <div className="topbar_left">
            <MenuFoldOutlined onClick={handleClick} />
          </div>
          <div className="topbar_right">
            <div className="topbar_icons topbarOne">
              <MailOutlined className='topbar_icon'/>
            </div>
            <div className="topbar_icons topbarOne">
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