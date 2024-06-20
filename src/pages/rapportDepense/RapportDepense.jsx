import React from 'react'
import './rapportDepense.scss'
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { useState } from 'react';
import config from '../../config';
import { useEffect } from 'react';
import axios from 'axios';


const RapportDepense = () => {
    const [depenses, setDepenses] = useState([]);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [open, setOpen] = useState(false);


      useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/depense/countJour`);
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

export default RapportDepense