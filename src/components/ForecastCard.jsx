import React from "react";
import "./ForecastCard.css";

function ForecastCard({ forecast }) {
  // Avoid breaking if forecast is empty or null
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="forecast-widget">
      <h3 className="forecast-title">📅 5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, index) => {
          const date = new Date(day.dt_txt);
          const weekday = date.toLocaleDateString("en-US", {
            weekday: "short",
          });
          const dayMonth = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });
          const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

          return (
            <div className="forecast-item" key={index}>
              <p className="forecast-day">{weekday}</p>
              <p className="forecast-date">{dayMonth}</p>
              <img
                src={icon}
                alt={day.weather[0].description}
                className="forecast-icon"
              />
              <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
              <p className="forecast-condition">{day.weather[0].main}</p>

              {/* 🔍 Tooltip */}
              <div className="forecast-tooltip">
                <p>🔼 Max: {Math.round(day.main.temp_max)}°C</p>
                <p>🔽 Min: {Math.round(day.main.temp_min)}°C</p>
                <p>💧 Humidity: {day.main.humidity}%</p>
                <p>📈 Pressure: {day.main.pressure} hPa</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ForecastCard;
