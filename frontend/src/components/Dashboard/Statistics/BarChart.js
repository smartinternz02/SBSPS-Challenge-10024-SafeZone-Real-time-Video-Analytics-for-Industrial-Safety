import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);


const BarChart = ({ data }) => {
  const months = Object.keys(data);
  const monthNames = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  }

  const monthData = months.map(month => monthNames[month]);
  const sensorData = months.map(month => data[month]['sensor_accidents']);
  const fireData = months.map(month => data[month]['fire_accidents']);

  const chartData = {
    labels: monthData,
    datasets: [
      {
        label: 'Sensor Accidents',
        data: sensorData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color for sensor accidents
        borderColor: 'rgba(75, 192, 192, 1)', // Border color for sensor accidents
        borderWidth: 1,
      },
      {
        label: 'Fire Accidents',
        data: fireData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Bar color for fire accidents
        borderColor: 'rgba(255, 99, 132, 1)', // Border color for fire accidents
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
