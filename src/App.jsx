import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import WeatherTrivia from "./components/WeatherTrivia";
import WeatherMusicPlayer from "./components/WeatherMusicPlayer";
import WeatherOverlay from "./components/WeatherOverlay";
import TimeSunriseWidget from "./components/TimeSunriseWidget";

// 🌐 Video imports
const getVideoSrc = () => {
  if (!weather || !weather.weather || !weather.weather[0]) return "/videos/default1.mp4";
  const icon = weather.weather[0].icon;

  switch (icon) {
    case "01d": return "/videos/clear-day.mp4";
    case "01n": return "/videos/clear-night.mp4";
    case "02d":
    case "03d":
    case "04d": return "/videos/cloudy-day.mp4";
    case "02n":
    case "03n":
    case "04n": return "/videos/cloudy-night.mp4";
    case "09d":
    case "10d": return "/videos/rainy-day.mp4";
    case "09n":
    case "10n": return "/videos/rainy-night.mp4";
    case "11d":
    case "11n": return "/videos/thunder.mp4";
    case "13d":
    case "13n": return "/videos/snow.mp4";
    case "50d":
    case "50n": return "/videos/foggy.mp4";
    default: return "/videos/default1.mp4";
  }
};


const API_KEY = "bdac4a2e63d74177dbbf0f7556ac76a6";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [temps, setTemps] = useState(null);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (weather) {
      console.log("Weather data updated for:", city);
    }
  }, [weather, city]);

  const handleSearch = async (customCity) => {
    const searchCity = customCity || city;
    if (!searchCity) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setError("");
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      setForecast(extractDailyForecast(forecastRes.data.list));
      setTemps(extractTempsByTime(forecastRes.data.list));
    } catch (err) {
      setWeather(null);
      setForecast([]);
      setTemps(null);
      setError("City not found or API error 😢");
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        setError("");
        const { latitude, longitude } = position.coords;

        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        setWeather(weatherRes.data);

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        setForecast(extractDailyForecast(forecastRes.data.list));
        setTemps(extractTempsByTime(forecastRes.data.list));

        setCity("");
      } catch (err) {
        setError("Failed to fetch weather for your location.");
      }
    }, () => {
      setError("Location access denied.");
    });
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("🚫 Voice recognition not supported. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    setListening(true);
    let finalTranscript = "";

    recognition.start();

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      if (finalTranscript) {
        setCity(finalTranscript.trim());
        handleSearch(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      setError("Voice error: " + event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      if (!finalTranscript) {
        setError("Didn't catch that. Try again 🎙️");
      }
    };
  };

  const extractDailyForecast = (list) => {
    const result = [];
    const seen = new Set();
    for (let item of list) {
      const date = item.dt_txt.split(" ")[0];
      if (!seen.has(date)) {
        seen.add(date);
        result.push(item);
      }
    }
    return result.slice(0, 5);
  };

  const extractTempsByTime = (list) => {
    const targetHours = {
      morn: "06:00:00",
      day: "12:00:00",
      eve: "18:00:00",
      night: "00:00:00",
    };

    const temps = { morn: 0, day: 0, eve: 0, night: 0 };

    for (let item of list) {
      const time = item.dt_txt.split(" ")[1];
      const temp = item.main.temp;
      for (let key in targetHours) {
        if (time === targetHours[key]) {
          temps[key] = temp;
        }
      }
    }
    return temps;
  };

  const getVideoSrc = () => {
  if (!weather || !weather.weather || !weather.weather[0]) return "/videos/default1.mp4";
  const icon = weather.weather[0].icon;

  switch (icon) {
    case "01d": return "/videos/clear-day.mp4";
    case "01n": return "/videos/clear-night.mp4";
    case "02d":
    case "03d":
    case "04d": return "/videos/cloudy-day.mp4";
    case "02n":
    case "03n":
    case "04n": return "/videos/cloudy-night.mp4";
    case "09d":
    case "10d": return "/videos/rainy-day.mp4";
    case "09n":
    case "10n": return "/videos/rainy-night.mp4";
    case "11d":
    case "11n": return "/videos/thunder.mp4";
    case "13d":
    case "13n": return "/videos/snow.mp4";
    case "50d":
    case "50n": return "/videos/foggy.mp4";
    default: return "/videos/default1.mp4";
  }
};


  return (
    <div className="app">
      {/* 🌐 Background Video */}
      <video
  key={getVideoSrc()}  // 💡 This forces React to re-render video when src changes
  autoPlay
  muted
  loop
  className="background-video"
>
  <source src={getVideoSrc()} type="video/mp4" />
</video>

      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔎 Search the city, vibe the weather..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => handleSearch()}>🔍</button>
          <button
            onClick={handleVoiceSearch}
            className={`mic-button ${listening ? "listening" : ""}`}
          >
            🎙️
          </button>
          {listening && (
            <div className="audio-wave">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
          )}
        </div>
      </div>

      <button className="geo-button-fixed" onClick={handleGeolocation}>
        Use My Location 🌍
      </button>

      <div className="overlay">
        {error && <p className="error-msg">{error}</p>}
        {!weather ? (
          <div className="welcome-screen">
            <h1 className="welcome-title">🌍 Weather Vibe</h1>
            <p className="welcome-subtitle">Discover the weather and tune into the perfect vibe!</p>
            <p className="welcome-hint"></p>
          </div>
        ) : (
          <div className="content-wrapper">
            <WeatherOverlay icon={weather.weather[0].icon} />
            <WeatherCard data={weather} temps={temps} />
            <div className="sidebar-content">
              <WeatherTrivia />
              <WeatherMusicPlayer weather={weather} />
            </div>
            {forecast.length > 0 && <ForecastCard forecast={forecast} />}
            <TimeSunriseWidget lat={weather.coord.lat} lon={weather.coord.lon} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
