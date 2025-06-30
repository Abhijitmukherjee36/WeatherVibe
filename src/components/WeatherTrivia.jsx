import React from "react";
import "./WeatherTrivia.css";

function WeatherTrivia() {
  const triviaItems = [
    "Did you know? Lightning strikes the Earth about 8 million times per day!",
    "The highest temperature ever recorded was 56.7°C (134°F) in Death Valley, 1913.",
    "Rainbows are caused by the refraction of sunlight in water droplets.",
    "The shortest war in history lasted 38 minutes!",
    "Clouds can weigh up to 500 tons, but they float due to their low density.",
  ];

  const randomTrivia = triviaItems[Math.floor(Math.random() * triviaItems.length)];

  return (
    <div className="weather-trivia-widget">
      <h3 className="weather-trivia-title">🌦️ Weather Trivia</h3>
      <p className="weather-trivia-text">{randomTrivia}</p>
    </div>
  );
}

export default WeatherTrivia;