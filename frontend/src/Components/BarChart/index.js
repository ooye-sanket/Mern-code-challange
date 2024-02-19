import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "./style.css";

function BarChart({ data }) {
  // console.log(data);
  if (!data) {
    return <div>Loading...</div>; 
  }


  const BarChartData = {
    labels: Object.keys(data.data),
    datasets: [
      {
        label: "Transactions",
        backgroundColor: "#19c1e3",
        borderColor: "#19c1e3",
        data: Object.values(data.data),
      },
    ],
  };

  return (
    <div>
      <Bar className="data-BarChart" data={BarChartData} />
    </div>
  );
}

export default BarChart;
