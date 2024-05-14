import React from 'react'
import './client.scss'
import { Breadcrumb } from 'antd'

const Client = () => {

    
  return (
    <>
      <div className="client">
        <div className="client_wrapper">
          <div className="client_wrapper_top">
            <Breadcrumb
                separator=">"
                items={[
                  {
                    title: 'Accueil',
                  },
                  {
                    title: 'Application Center',
                    href: '/',
                  }
                ]}
            />
          </div>
          <div className="client_wrapper_bottom"></div>
        </div>
      </div>
    </>
  )
}

export default Client