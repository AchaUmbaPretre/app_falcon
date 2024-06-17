import React from 'react'
import './rapportGlobal.scss'
import { Tabs } from 'antd'

const RapportGlobal = () => {
  return (
    <>
        <div className="rapportGlobal">
            <div className="rapportWrapper">
                <div className="rapport_left">
                    <h2 className="rapport_h2">Rapport de dépenses de Ndoé</h2>
                    <div className="rapport_wrapper_pan">
                        <Tabs>
                            <Tabs.TabPane tab='Aujourdui' key={1}>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Hier" key={2}>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab='7 derniers jours' key={3}>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab='30 derniers jours' key={4}>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
                <div className="rapport_right">
                <h2 className="rapport_h2">Rapport de dépenses de Falcon</h2>

                </div>
            </div>
        </div>

    </>
  )
}

export default RapportGlobal