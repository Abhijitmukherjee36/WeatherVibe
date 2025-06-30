import React, { useEffect, useState } from "react";
import "./TimeSunriseWidget.css";

const API_KEY = "bdac4a2e63d74177dbbf0f7556ac76a6";

function TimeSunriseWidget({ lat, lon }) {
  const [time, setTime] = useState("00:00:00");
  const [sunrise, setSunrise] = useState("–");
  const [sunset, setSunset] = useState("–");
  const [timezoneOffset, setTimezoneOffset] = useState(null);
  const [error, setError] = useState(null);
  const [flip, setFlip] = useState(false); // State for flip animation
  const [moonPhase, setMoonPhase] = useState("🌑"); // Default moon phase icon

  useEffect(() => {
    if (!lat || !lon) {
      setError("Invalid coordinates");
      return;
    }

    // Fetch timezone and sunrise/sunset times
    const fetchTimezoneAndSun = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        const offsetInSeconds = data.timezone; // Offset in seconds from UTC
        setTimezoneOffset(offsetInSeconds);
        console.log(`Timezone offset for lat=${lat}, lon=${lon}: ${offsetInSeconds} seconds`);

        // Format sunrise and sunset times adjusted for local timezone
        const formatSunTime = (unix) => {
          const date = new Date((unix + offsetInSeconds) * 1000);
          return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC",
          });
        };

        setSunrise(formatSunTime(data.sys.sunrise));
        setSunset(formatSunTime(data.sys.sunset));
        setError(null);
      } catch (err) {
        console.error("Failed to load timezone/sun info:", err);
        setError("Failed to fetch timezone data");
        setSunrise("–");
        setSunset("–");
        setTimezoneOffset(null);
      }
    };

    fetchTimezoneAndSun();
  }, [lat, lon]);

  useEffect(() => {
    if (timezoneOffset === null) return;

    // Calculate moon phase based on current date
    const getMoonPhase = (date) => {
      const lunarCycle = 29.53058867 * 24 * 60 * 60 * 1000; // Lunar cycle in milliseconds
      const referenceDate = new Date("2000-01-06T00:00:00Z").getTime(); // Known new moon
      const currentTime = date.getTime();
      const diff = currentTime - referenceDate;
      const phase = (diff % lunarCycle) / lunarCycle;
      const normalizedPhase = phase < 0 ? phase + 1 : phase;

      // Map phase to moon emoji
      if (normalizedPhase < 0.05 || normalizedPhase >= 0.95) return "🌑"; // New Moon
      if (normalizedPhase < 0.20) return "🌒"; // Waxing Crescent
      if (normalizedPhase < 0.30) return "🌓"; // First Quarter
      if (normalizedPhase < 0.45) return "🌔"; // Waxing Gibbous
      if (normalizedPhase < 0.55) return "🌕"; // Full Moon
      if (normalizedPhase < 0.70) return "🌖"; // Waning Gibbous
      if (normalizedPhase < 0.80) return "🌗"; // Last Quarter
      return "🌘"; // Waning Crescent
    };

    // Update clock and moon phase every second
    const updateClock = () => {
      const utcTime = new Date(); // Current UTC time
      const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000);
      const timeString = localTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });
      setTime(timeString);
      setMoonPhase(getMoonPhase(localTime)); // Update moon phase
      setFlip((prev) => !prev); // Toggle flip state to trigger animation
      console.log(`Current UTC: ${utcTime}, Local time: ${localTime}, Display: ${timeString}, Moon: ${moonPhase}`);
    };

    updateClock(); // Initial call
    const interval = setInterval(updateClock, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [timezoneOffset, moonPhase]);

  return (
    <div className="time-widget-fixed">
      <h3 className={`time-title ${flip ? "flip" : ""}`}>
        🕒 {error ? "Error: Check Console" : time} {moonPhase}
      </h3>
      <div className="sun-times">
        <p>🌅 {sunrise}</p>
        <p>🌇 {sunset}</p>
      </div>
    </div>
  );
}

export default TimeSunriseWidget;