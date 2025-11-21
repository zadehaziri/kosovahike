import {
  Accordion,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItem,
  AccordionItemButton,
} from "react-accessible-accordion";
import "./weather-forecast.scss";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Forecast = ({ data }) => {
  const dayWeek = new Date().getDay();
  const forecastDay = WEEK_DAYS.slice(dayWeek, WEEK_DAYS.length).concat(
    WEEK_DAYS.slice(0, dayWeek)
  );
  console.log(forecastDay);

  return (
    <div>
      <label className="title">Forecast</label>
      <Accordion allowZeroExpanded>
        {data.list.splice(0, 5).map((item, index) => (
          <AccordionItem key={index}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className="daily-item">
                  <img
                    className="weather-icon"
                    src={require(`./weather-foto/${item.weather[0].icon}.png`)}
                    alt="weather"
                  />
                  <label className="day">{forecastDay[index]}</label>
                  <label className="description">
                    {item.weather[0].description}
                  </label>
                  <label className="Temperature">
                    {Math.round(item.main.temp_min - 273.15)}°C
                  </label>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="daily-panel">
                <div className="item">
                  <label>Feels like: </label>
                  <label>{Math.round(item.main.feels_like - 273.15)}°C</label>
                </div>
                <div className="item">
                  <label>Clouds: </label>
                  <label>{item.clouds.all}%</label>
                </div>
                <div className="item">
                  <label>Pressure: </label>
                  <label>{item.main.pressure} Pa</label>
                </div>
                <div className="item">
                  <label>Humidity: </label>
                  <label>{item.main.humidity}g/kg</label>
                </div>
                <div className="item">
                  <label>Wind Speed: </label>
                  <label>{item.wind.speed} m/s</label>
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default Forecast;
