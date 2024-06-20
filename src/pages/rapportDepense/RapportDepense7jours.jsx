import React from 'react'
import './rapportDepense.scss'
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { useState } from 'react';
import config from '../../config';
import { useEffect } from 'react';
import axios from 'axios';


const RapportDepense7jours = () => {
    const [depenses, setDepenses] = useState([]);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;


      useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/depense/count7jours`);
            setDepenses(data[0]?.total_depense);
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, [DOMAIN]);

  return (
    <>
        <div className="rowTotals">
            <div className="rowTotal-wrapper">
                <div className="rowTotal">
                    <div className="rowTotal-left" style={{background : 'rgba(255, 0, 0, 0.164)'}}>
                        <VerticalAlignTopOutlined className='rowTotalIcon' style={{color: 'red'}}/>
                    </div>
                    <div className="rowTotal-right">
                        <h2><CountUp end={depenses}/>$</h2>
                        <span className="rowTotal-span">Montant total des dépenses</span>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default RapportDepense7jours