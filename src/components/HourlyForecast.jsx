import React from "react";
import "./HourlyForecast.css";

function HourlyForecast({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="hourly-forecast-widget">
      <h3 className="hourly-forecast-title">⏰ Hourly Forecast</h3>
      <div className="hourly-forecast-grid">
        {forecast.map((hour, index) => {
          const time = new Date(hour.dt_txt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            hour12: true,
          });
          const icon = `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`;
          const temp = Math.round(hour.main.temp);

          return (
            <div className="hourly-forecast-item" key={index}>
              <p className="hourly-time">{time}</p>
              <img
                src={icon}
                alt={hour.weather[0].description}
                className="hourly-icon"
              />
              <p className="hourly-temp">{temp}°C</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;