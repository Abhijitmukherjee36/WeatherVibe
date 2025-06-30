import React from "react";

function SearchBar({ city, setCity, onSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Type a city... 🔍"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="search-input"
      />
      <button onClick={onSearch} className="search-button">
        Get Vibe
      </button>
    </div>
  );
}

export default SearchBar;
