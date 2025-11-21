import "./current-weather.scss";
import windImg from "./wind.png";
import humidityImg from "./humidity.png";
import wisibilityImg from "./wisibility.png";
const CurrentWeather = ({ data }) => {
  if (!data) {
    return null;
  }
  return (
    <div className="weather">
      {/* <div className="top">
        <div>
          <p className="city"> city: {data.city}</p>
        </div>
      </div> */}
      <div className="bottom">
        <div className="first-section-weather">
          <div className="parameter-row">
            <h1 className="Temperature">
              {Math.round(data.main.temp - 273.15)}°C
            </h1>
            <span className="parameter-label">Feels like </span>
            <span className="parameter-value">
              {Math.round(data.main.feels_like - 273.15)}°C
            </span>
          </div>
        </div>

        <div className="second-section-weather">
          <img
            src={require(`./weather-foto/${data.weather[0].icon}.png`)}
            alt="weather"
            className="weather-icon"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="weather-description">{data.weather[0].main}</p>
        </div>

        {/* <div className="parameter-row">
            <span className="parameter-label-top">Details</span>
          </div> */}

        <div className="third-section-weather">
          <div className="parameter-row">
            {/* <span className="parameter-label">Wind</span> */}
            <img src={windImg} alt="Wind Icon" />
            <p className="parameter-value">{data.wind.speed} m/s</p>
          </div>
          <div className="parameter-row">
            {/* <span className="parameter-label">Humidity</span> */}
            <img src={humidityImg} />
            <p className="parameter-value">{data.main.humidity} g/kg</p>
          </div>
          <div className="parameter-row">
            {/* <span className="parameter-label">Visibility</span> */}
            <img src={wisibilityImg} />
            <p className="parameter-value"> {data.visibility}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CurrentWeather;
