import React, { useState } from 'react';
import { Tabs } from 'antd';
import './informationGen.scss';
import RapportInfoJour from '../../pages/rapportInfo/RapportInfoJour';
import RapportInfoHier from '../../pages/rapportInfo/RapportInfoHier';
import RapportInfo7jours from '../../pages/rapportInfo/RapportInfo7jours';
import RapportInfo30jours from '../../pages/rapportInfo/RapportInfo30jours';
import RapportInfo1an from '../../pages/rapportInfo/RapportInfo1an';
import RapportDepense from '../../pages/rapportDepense/RapportDepense';
import RapportDepenseHier from '../../pages/rapportDepense/RapportDepenseHier';
import RapportDepense7jours from '../../pages/rapportDepense/RapportDepense7jours';
import RapportDepense30jours from '../../pages/rapportDepense/RapportDepense30jours';
import RapportDepense1an from '../../pages/rapportDepense/RapportDepense1an';

const InformationGen = () => {
  const [activeTabKey, setActiveTabKey] = useState('0');

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  return (
    <div className='informationGeneral'>
      <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
        <Tabs.TabPane tab="Aujourd'hui" key="0">
          <RapportDepense period="today" />
          <RapportInfoJour period="today" />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Hier' key="1">
          <RapportDepenseHier period="yesterday" />
          <RapportInfoHier period="yesterday" />
        </Tabs.TabPane>
        <Tabs.TabPane tab='7 derniers jours' key="2">
          <RapportDepense7jours period="last7days" />
          <RapportInfo7jours period="last7days" />
        </Tabs.TabPane>
        <Tabs.TabPane tab='30 derniers jours' key="3">
          <RapportDepense30jours period="last30days" />
          <RapportInfo30jours period="last30days" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="1 an" key="4">
          <RapportDepense1an period="last1year" />
          <RapportInfo1an period="last1year" />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default InformationGen;
