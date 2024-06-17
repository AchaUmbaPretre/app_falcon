import React, { useEffect, useState } from 'react'
import rapportImg from './../../../assets/depenses.jpg'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import config from '../../../config';
import { Skeleton } from 'antd';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const RapportNdoeDuJour = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [loading, setLoading] = useState(true);
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
    <>
        <div className="rapportDuJour">
            <div className="rapport_wrapper">
                <div className="rapport_wrapper_top">
                    <div className="rapport_row">
                        <img src={rapportImg} alt="" className="rapport_img" />
                    </div>
                    <div className="rapport_row">
                        <span className="rapport_montant">100$</span>
                        <span className="rapport_desc">Montant total des dépenses</span>
                    </div>
                </div>
                <div className="rapport_wrapper_bottom">
                {loading ? (
                    <Skeleton active />
                ) : (
                    <Pie data={chartData} />
                )}
                </div>
            </div>
        </div>
    </>
  )
}

export default RapportNdoeDuJour