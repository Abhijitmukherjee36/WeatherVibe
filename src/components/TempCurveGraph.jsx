import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

function TempCurveGraph({ hourlyData }) {
  if (!hourlyData || hourlyData.length === 0) return null;

  const shortData = hourlyData.slice(0, 8); // next 8 hours only

  const labels = shortData.map(hour =>
    new Date(hour.dt * 1000).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const temps = shortData.map(hour => hour.main.temp);

  const data = {
    labels,
    datasets: [
      {
        label: "Hourly Temp (°C)",
        data: temps,
        fill: true,
        borderColor: "#00ffc3",
        backgroundColor: "rgba(0, 255, 204, 0.08)",
        tension: 0.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        ticks: {
          color: "#ccc",
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `🌡️ ${context.parsed.y}°C at ${context.label}`,
        },
      },
    },
  };

  return (
    <div className="temp-graph">
      <Line data={data} options={options} />
    </div>
  );
}

export default TempCurveGraph;
