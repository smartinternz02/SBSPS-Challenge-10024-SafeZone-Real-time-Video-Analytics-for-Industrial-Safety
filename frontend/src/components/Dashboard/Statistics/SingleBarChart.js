import React from 'react';
import { Pie } from 'react-chartjs-2';
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);


const SingleChart = ({ safetyData }) => {
    console.log(safetyData);
    const locations = safetyData.map((item) => item.location);
    const safetyScores = safetyData.map((item) => item.safety_score);

  const chartData = {
    labels: locations,
    datasets: [
      {
        label: "Safety Score",
        data: safetyScores,
        backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
        borderColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ], // Border color for sensor accidents
        borderWidth: 1,
      }
    ],
  };

  return <Pie data={chartData} />;
};

export default SingleChart;
