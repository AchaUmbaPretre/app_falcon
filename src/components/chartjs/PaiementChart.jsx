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
import { faker } from '@faker-js/faker';
import './paiementChart.scss'
import config from '../../config';
import axios from 'axios';
import { Skeleton } from 'antd';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
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
    },
  },
};

const labels = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre','Octobre'];


const PaiementChart = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [paiementData, setPaiementData] = useState(null);
  const [depenses, setDepenses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/depense/paiementMois`);
        const paiementData = data.map(({ mois, paiement_total }) => ({
          x: labels[mois - 1],
          y: paiement_total,
        }));
        setPaiementData(paiementData);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/depense/depenseMois`);
        const depenseData = data.map(({ mois, total_depense }) => ({
          x: labels[mois - 1],
          y: total_depense,
        }));
        setDepenses(depenseData);
        setLoading(false);
      } catch (error) {
        console.log(error);
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
        stack: 'Stack 0',
      },
    ],
  };

  return (
    <div className='PaiementChart'>
      <h2 className='paiement_h2'>Paiement</h2>
      {loading ? (
        <Skeleton active />
      ) : (
        <Bar options={options} data={data} />
      )}
    </div>
  );
};

export default PaiementChart;
