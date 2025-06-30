import React, { useState, useEffect } from "react";
import "./WeatherMusicPlayer.css";

function WeatherMusicPlayer({ weather }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [suggestedMusic, setSuggestedMusic] = useState([]);

  useEffect(() => {
    if (weather && weather.weather && weather.weather[0]) {
      const weatherCondition = weather.weather[0].main.toLowerCase();
      let musicSuggestions = [];

      switch (weatherCondition) {
        case "clear":
          musicSuggestions = ["Pop: 'Happy' by Pharrell Williams", "Pop: 'Can’t Stop the Feeling!' by Justin Timberlake"];
          break;
        case "clouds":
          musicSuggestions = ["Indie: 'The Night We Met' by Lord Huron", "Acoustic: 'Hallelujah' by Leonard Cohen"];
          break;
        case "rain":
          musicSuggestions = ["Jazz: 'So What' by Miles Davis", "Blues: 'Stormy Weather' by Etta James"];
          break;
        case "snow":
          musicSuggestions = ["Classical: 'Winter' by Vivaldi", "Chill: 'Snowman' by Sia"];
          break;
        case "thunderstorm":
          musicSuggestions = ["Rock: 'Thunderstruck' by AC/DC", "Electronic: 'Storm' by Ruelle"];
          break;
        default:
          musicSuggestions = ["Chill: 'Weightless' by Marconi Union", "Ambient: 'Clair de Lune' by Debussy"];
      }

      setSuggestedMusic(musicSuggestions);
    }
  }, [weather]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Note: This is a mock player; in a real app, integrate with an audio API (e.g., Spotify).
    console.log("Toggled play state to:", !isPlaying);
  };

  return (
    <div className="weather-music-player-widget">
      <h3 className="weather-music-player-title">🎵 Weather Tunes</h3>
      {weather && weather.weather && weather.weather[0] ? (
        <>
          <p className="weather-music-player-text">
            Suggested for {weather.weather[0].main}: {suggestedMusic.join(" | ")}
          </p>
          <div className="weather-music-player-controls">
            <button onClick={togglePlay} className="weather-music-player-button">
              {isPlaying ? "⏸️ Pause" : "▶️ Play"}
            </button>
          </div>
        </>
      ) : (
        <p className="weather-music-player-text">Loading weather-based music...</p>
      )}
    </div>
  );
}

export default WeatherMusicPlayer;