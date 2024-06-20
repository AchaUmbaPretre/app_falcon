import React from 'react'
import { Tabs } from 'antd';
import './informationGen.scss'
import RapportInfoJour from '../../pages/rapportInfo/RapportInfoJour';
import RapportInfoHier from '../../pages/rapportInfo/RapportInfoHier';
import RapportInfo7jours from '../../pages/rapportInfo/RapportInfo7jours';
import RapportInfo30jours from '../../pages/rapportInfo/RapportInfo30jours';
import RapportInfo1an from '../../pages/rapportInfo/RapportInfo1an';
const InformationGen = () => {
  return (
    <>
        <div className='informationGeneral'>
        <Tabs>
            <Tabs.TabPane tab="Aujourd'hui" key={0}>
                <RapportInfoJour/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Hier' key={1}>
                <RapportInfoHier/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='7 derniers jours' key={2}>
                <RapportInfo7jours/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='30 derniers jours' key={3}>
                <RapportInfo30jours/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="1 an" key={4}>
                <RapportInfo1an/>
            </Tabs.TabPane>
        </Tabs>
        </div>
    </>
  )
}

export default InformationGen