/**
 * Fetches current weather data from Open-Meteo API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export const fetchWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m,relative_humidity_2m&timezone=auto`
    );
    
    if (!response.ok) throw new Error("Weather data fetch failed");
    
    const data = await response.json();
    return {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      conditionCode: data.current.weather_code,
      // Map WMO weather codes to readable text
      condition: getWeatherDescription(data.current.weather_code)
    };
  } catch (err) {
    console.error("Open-Meteo Error:", err);
    return null;
  }
};

/**
 * Maps WMO weather codes to human-readable descriptions
 * https://open-meteo.com/en/docs
 */
const getWeatherDescription = (code) => {
  const codes = {
    0: "Clear Sky",
    1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Foggy", 48: "Depositing Rime Fog",
    51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
    61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
    71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow",
    95: "Thunderstorm",
  };
  return codes[code] || "Cloudy";
};
