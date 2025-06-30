import React, { useState, useEffect } from "react";
import "./WeatherMusicPlayer.css";

// Spotify Client ID (Replace with your actual Spotify Client ID)
const SPOTIFY_CLIENT_ID = "0e236509e9034de48002de6c1ff0963c";

// Function to get Spotify access token (simplified client-side Implicit Grant Flow)
const getSpotifyAccessToken = async (clientId) => {
  // In a production app, use Authorization Code Flow with a backend
  // This is a simplified client-side approach for demonstration
  try {
    const redirectUri = window.location.origin;
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private%20user-read-email%20user-top-read`;
    
    // Check if token is already in URL hash (post-redirect)
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const token = params.get("access_token");
      if (token) return token;
    }

    // If no token, redirect to Spotify auth
    window.location = authUrl;
    return null;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    return null;
  }
};

// Function to fetch Spotify recommendations based on weather
const fetchSpotifyRecommendations = async (weatherCondition, token) => {
  if (!token) return [];

  const weatherToGenre = {
    clear: "pop",
    clouds: "indie",
    rain: "jazz",
    snow: "classical",
    thunderstorm: "rock",
  };

  const genre = weatherToGenre[weatherCondition] || "chill";

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=2`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch recommendations");

    const data = await response.json();
    return data.tracks.map(
      (track) => `${track.artists[0].name} - ${track.name}`
    );
  } catch (error) {
    console.error("Error fetching Spotify recommendations:", error);
    return [];
  }
};

function WeatherMusicPlayer({ weather }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [suggestedMusic, setSuggestedMusic] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  // Get Spotify access token on component mount
  useEffect(() => {
    const initializeSpotify = async () => {
      const token = await getSpotifyAccessToken(SPOTIFY_CLIENT_ID);
      setAccessToken(token);
    };
    initializeSpotify();
  }, []);

  // Fetch music recommendations when weather or access token changes
  useEffect(() => {
    if (weather && weather.weather && weather.weather[0] && accessToken) {
      const weatherCondition = weather.weather[0].main.toLowerCase();
      fetchSpotifyRecommendations(weatherCondition, accessToken).then((tracks) => {
        setSuggestedMusic(tracks.length > 0 ? tracks : ["No recommendations available"]);
      });
    } else {
      setSuggestedMusic(["Loading weather-based music..."]);
    }
  }, [weather, accessToken]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Note: To actually play music, integrate Spotify Web Playback SDK
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
