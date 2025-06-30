// components/SunriseSunset.jsx
import React from "react";

function formatTime(unix, timezoneOffset) {
  const local = new Date((unix + timezoneOffset) * 1000);
  return local.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function SunriseSunset({ sunrise, sunset, timezone }) {
  return (
    <div className="sun-times">
      <p>🌅 <strong>Sunrise:</strong> {formatTime(sunrise, timezone)}</p>
      <p>🌇 <strong>Sunset:</strong> {formatTime(sunset, timezone)}</p>
    </div>
  );
}

export default SunriseSunset;
