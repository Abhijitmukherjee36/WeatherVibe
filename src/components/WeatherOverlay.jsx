// components/WeatherOverlay.jsx
import React from "react";
import "./WeatherOverlay.css"; // Custom overlay animations

function WeatherOverlay({ icon }) {
  const renderOverlay = () => {
    if (icon.includes("09") || icon.includes("10"))
      return <div className="rain-overlay" />;
    if (icon.includes("13")) return <div className="snow-overlay" />;
    if (icon.includes("01n")) return <div className="stars-overlay" />;
    if (
      icon.startsWith("02") ||
      icon.startsWith("03") ||
      icon.startsWith("04")
    ) {
      return <div className="clouds-overlay" />;
    }
    if (icon === "50d" || icon === "50n") {
      return <div className="fog-overlay" />;
    }
    if (icon === "01d") {
      return <div className="sunlight-overlay" />;
    }

    return null;
  };

  return <>{renderOverlay()}</>;
}

export default WeatherOverlay;
