import React from 'react'
import './rightbar.scss'
import PageViews from '../../components/pageViews/PageViews'
import PaiementChart from '../../components/chartjs/PaiementChart'
import PieChart from '../../components/chartPie/ChartPie'
import Traceur from '../traceur/Traceur'

const Rightbar = () => {

  return (
    <>
      <div className="rightbar">
        <div className="rightbar_wrapper">
          <PageViews/>
          <div className='rightbar_rows'>
            <PaiementChart/>
            <PieChart/>
          </div>
          <Traceur/>
        </div>
      </div>
    </>
  )
}

export default Rightbar