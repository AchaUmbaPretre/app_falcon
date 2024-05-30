import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './chartPie.scss'

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartPie = {
  labels: ['Rouge', 'Bleu', 'Jaune', 'Vert', 'Violet', 'Orange'],
  datasets: [
    {
      label: '# des Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',  // Rouge
        'rgba(54, 162, 235, 0.5)',  // Bleu
        'rgba(255, 206, 86, 0.5)',  // Jaune
        'rgba(75, 192, 192, 0.5)',  // Vert
        'rgba(153, 102, 255, 0.5)', // Violet
        'rgba(255, 159, 64, 0.5)',  // Orange
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',    // Rouge
        'rgba(54, 162, 235, 1)',    // Bleu
        'rgba(255, 206, 86, 1)',    // Jaune
        'rgba(75, 192, 192, 1)',    // Vert
        'rgba(153, 102, 255, 1)',   // Violet
        'rgba(255, 159, 64, 1)',    // Orange
      ],
      borderWidth: 1,
    },
  ],
};

const PieChart = () => {
  return (
    <>
        <div className='pieChart'>
            <Pie data={ChartPie} />
        </div>
    </>
  )
};

export default PieChart;
