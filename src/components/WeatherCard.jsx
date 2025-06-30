import React from "react";
import "./WeatherCard.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

function WeatherCard({ data }) {
  if (!data) return null;

  const { name, sys, main, weather, wind, visibility } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const condition = weather[0].main;

  // 🕐 Use time-based hourly forecast labels
  const times = ["03:00", "06:00", "09:00", "12:00"];
  const temps = [main.temp - 3, main.temp - 1, main.temp + 1, main.temp + 2];

  const chartData = {
    labels: times,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temps,
        borderColor: "#00ffe5",
        backgroundColor: "rgba(0, 255, 204, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#00ffe5",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#aaa" },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#aaa",
          callback: (val) => `${val}°C`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111",
        titleColor: "#00ffe5",
        bodyColor: "#fff",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="weather-container">
      {/* Top Widget: Weather Overview + Chart */}
      <div className="weather-widget">
        <div className="weather-left">
          <div className="weather-icon-center">
            <img src={iconUrl} alt={condition} className="weather-icon" />
          </div>
          <div className="weather-details">
            <h1 className="temperature">{main.temp.toFixed(1)}°C</h1>
            <div className="minmax-row">
              <span>🔼 {main.temp_max}°C</span>
              <span>🔽 {main.temp_min}°C</span>
            </div>
            <p className="location">
              📍 {name}, {sys.country}
            </p>
          </div>
        </div>

        {/* ⏱️ Temp Graph */}
        <div className="temp-graph">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Bottom Widget: Weather Metrics */}
      <div className="analytics-widget">
        <div className="metric-box">
          <p>💧 Humidity</p>
          <h4>{main.humidity}%</h4>
        </div>
        <div className="metric-box">
          <p>🌬 Wind</p>
          <h4>{wind.speed} m/s</h4>
        </div>
        <div className="metric-box">
          <p>👁 Visibility</p>
          <h4>{(visibility / 1000).toFixed(1)} km</h4>
        </div>
        <div className="metric-box">
          <p>📈 Pressure</p>
          <h4>{main.pressure} hPa</h4>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
