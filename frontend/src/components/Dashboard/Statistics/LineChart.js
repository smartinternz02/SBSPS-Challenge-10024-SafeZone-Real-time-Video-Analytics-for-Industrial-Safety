import React from 'react';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {Line} from 'react-chartjs-2';

Chart.register(CategoryScale);

const LineChart = ({ data }) => {
 
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

  const accidentData = months.map(
    (month) => data[month]['sensor_accidents'] + data[month]['fire_accidents']
  );

  const chartData = {
    labels: monthData,
    datasets: [
      {
        label: 'Total Accidents',
        data: accidentData,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)', // Color of the line
      },
    ],
  };


  return <Line data={chartData} />;
};

export default LineChart;
