import React from 'react'
import './rightbar.scss'
import PageViews from '../../components/pageViews/PageViews'

const Rightbar = () => {

  return (
    <>
      <div className="rightbar">
        <div className="rightbar_wrapper">
          <PageViews/>
        </div>
      </div>
    </>
  )
}

export default Rightbar