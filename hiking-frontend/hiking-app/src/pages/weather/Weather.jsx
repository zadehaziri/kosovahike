import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.scss";
import CurrentWeather from "./current-weather";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./searchapi.js";

const WEEK_DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function Weather({ location }) {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDayForecast, setSelectedDayForecast] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
        );

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          const weatherResponse = await axios.get(
            `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
          );

          const forecastResponse = await axios.get(
            `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
          );
          setForecast({ city: location, ...forecastResponse.data });
          setSelectedDayForecast({
            city: location,
            ...forecastResponse.data.list[0],
          });
        } else {
          throw new Error("Location not found");
        }
      } catch (error) {
        setError("Error fetching weather data");
      }
    };

    fetchWeatherData();
  }, [location]);

  const handleDayClick = (index) => {
    setSelectedDayForecast({ city: location, ...forecast.list[index] });
  };

  const currentDayIndex = new Date().getDay();
  const forecastDay = WEEK_DAYS.slice(currentDayIndex).concat(
    WEEK_DAYS.slice(0, currentDayIndex)
  );
  forecastDay[0] = "TODAY";

  return (
    <div className="weather-container">
      {error && <div>{error}</div>}
      {forecast && (
        <div className="forecast-container">
          {forecast.list.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className={`forecast-day ${
                selectedDayForecast && selectedDayForecast.dt === item.dt
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleDayClick(index)}
            >
              <span className="day">{forecastDay[index]}</span>
            </div>
          ))}
        </div>
      )}
      {forecast && <CurrentWeather data={selectedDayForecast} />}
    </div>
  );
}

export default Weather;
