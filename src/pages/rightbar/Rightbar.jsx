import React from 'react'
import './rightbar.scss'
import PageViews from '../../components/pageViews/PageViews'
import PaiementChart from '../../components/chartjs/PaiementChart'

const Rightbar = () => {

  return (
    <>
      <div className="rightbar">
        <div className="rightbar_wrapper">
          <PageViews/>
          <div>
            <PaiementChart/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Rightbar