import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Skeleton } from 'antd';
import axios from 'axios';
import './chartPie.scss';
import config from '../../config';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Total des Dépenses',
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.5)',  // Bleu
        'rgba(255, 99, 132, 0.5)',  // Rouge
        'rgba(255, 206, 86, 0.5)',  // Jaune
        'rgba(75, 192, 192, 0.5)',  // Vert
        'rgba(153, 102, 255, 0.5)', // Violet
        'rgba(255, 159, 64, 0.5)',  // Orange
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',    // Bleu
        'rgba(255, 99, 132, 1)',    // Rouge
        'rgba(255, 206, 86, 1)',    // Jaune
        'rgba(75, 192, 192, 1)',    // Vert
        'rgba(153, 102, 255, 1)',   // Violet
        'rgba(255, 159, 64, 1)',    // Orange
      ],
      borderWidth: 1,
    }],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepenses = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/depense/depenseMois`);

        if (data && Array.isArray(data)) {
          const labels = data.map(item => item.nom_categorie);
          const datasetData = data.map(item => item.total_depense);

          const newChartData = {
            labels: labels,
            datasets: [
              {
                label: 'Total des Dépenses',
                data: datasetData,
                backgroundColor: [
                  'rgba(75, 192, 192, 0.5)',  // Vert
                  'rgba(54, 162, 235, 0.5)',  // Bleu
                  'rgba(255, 99, 132, 0.5)',  // Rouge
                  'rgba(255, 206, 86, 0.5)',  // Jaune
                  'rgba(54, 162, 235, 0.5)',  // Bleu
                  'rgba(153, 102, 255, 0.5)', // Violet
                  'rgba(255, 159, 64, 0.5)',  // Orange
                ],
                borderColor: [
                  'rgba(75, 192, 192, 1)',    // Vert
                  'rgba(54, 162, 235, 1)',    // Bleu
                  'rgba(255, 99, 132, 1)',    // Rouge
                  'rgba(255, 206, 86, 1)',    // Jaune
                  'rgba(54, 162, 235, 1)',    // Bleu
                  'rgba(153, 102, 255, 1)',   // Violet
                  'rgba(255, 159, 64, 1)',    // Orange
                ],
                borderWidth: 1,
              },
            ],
          };

          setChartData(newChartData);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchDepenses();
  }, [DOMAIN]);

  return (
    <div className='pieChart'>
      <h2 className='depenses_h2'>Dépenses</h2>
      <hr className='depenses_hr'/>
      {loading ? (
        <Skeleton active />
      ) : (
        <Pie data={chartData} />
      )}
    </div>
  );
};

export default PieChart;
