import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Skeleton } from 'antd';
import './paiementChart.scss';
import config from '../../config';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Paiement et Dépenses Mensuels'
    },
  },
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true,
    },
  },
};

const labels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const PaiementChart = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [paiementData, setPaiementData] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paiementResponse = await axios.get(`${DOMAIN}/depense/paiementMois`);
        const depenseResponse = await axios.get(`${DOMAIN}/depense/depenseMois`);

        const paiementDataFormatted = labels.map((label, index) => {
          const data = paiementResponse.data.find(item => item.mois - 1 === index);
          return data ? data.paiement_total : 0;
        });

        const depenseDataFormatted = labels.map((label, index) => {
          const data = depenseResponse.data.find(item => item.mois - 1 === index);
          return data ? data.total_depense : 0;
        });

        setPaiementData(paiementDataFormatted);
        setDepenses(depenseDataFormatted);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [DOMAIN]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Paiement',
        data: paiementData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        stack: 'Stack 0',
      },
      {
        label: 'Dépenses',
        data: depenses,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        stack: 'Stack 1',
      },
    ],
  };

  return (
    <div className='PaiementChart'>
      <h2 className='paiement_h2'>Paiement</h2>
      <hr className='paiement_hr'/>
      {loading ? (
        <Skeleton active />
      ) : (
        <Bar options={options} data={data} />
      )}
    </div>
  );
};

export default PaiementChart;
