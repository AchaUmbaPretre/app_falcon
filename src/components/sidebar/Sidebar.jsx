import React from 'react'
import './sidebar.css'
import logo from './../../assets/falcon.png'

const Sidebar = () => {
  return (
    <>
      <div className="sidebar">
        <div className="sidebar_wrapper">
          <div className="sidebar_icons">
            <img src={logo} alt="" className='sidebar_img' />
          </div>
        </div>
      </div>

    </>
  )
}

export default Sidebar