import { useEffect, useState } from "react";
import { getTodayWeather, getForecast } from "../api/weather";
import "./WeatherCard.css";

// Helper function to format date as weekday
const formatWeekday = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Helper to check if date is today
const isToday = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const date = new Date(dateString);
  return today.toDateString() === date.toDateString();
};

// Custom SVG Icons
const WaterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 1024 1024" className="weather-icon-svg" fill="currentColor">
    <path d="M512 512m-480 0a480 480 0 1 0 960 0 480 480 0 1 0-960 0Z" fill="#84cc16" opacity="0.2"/>
    <path d="M512 179.2c-96 102.4-262.4 236.8-262.4 384s115.2 262.4 262.4 262.4 262.4-115.2 262.4-262.4-160-281.6-262.4-384z" fill="#84cc16" opacity="0.6"/>
    <path d="M512 684.8c-57.6 0-102.4-44.8-102.4-108.8 0-57.6 64-102.4 102.4-147.2 38.4 44.8 102.4 89.6 102.4 147.2 0 57.6-44.8 108.8-102.4 108.8z" fill="#84cc16"/>
  </svg>
);

const WindIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon-svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.25 5.5C6.25 3.70508 7.70507 2.25 9.5 2.25C11.2949 2.25 12.75 3.70507 12.75 5.5C12.75 7.29493 11.2949 8.75 9.5 8.75H3C2.58579 8.75 2.25 8.41421 2.25 8C2.25 7.58579 2.58579 7.25 3 7.25H9.5C10.4665 7.25 11.25 6.4665 11.25 5.5C11.25 4.5335 10.4665 3.75 9.5 3.75C8.5335 3.75 7.75 4.5335 7.75 5.5V5.85714C7.75 6.27136 7.41421 6.60714 7 6.60714C6.58579 6.60714 6.25 6.27136 6.25 5.85714V5.5Z" fill="currentColor"/>
    <path opacity="0.4" d="M3.25 14C3.25 13.5858 3.58579 13.25 4 13.25H18.5C20.8472 13.25 22.75 15.1528 22.75 17.5C22.75 19.8472 20.8472 21.75 18.5 21.75C16.1528 21.75 14.25 19.8472 14.25 17.5V17C14.25 16.5858 14.5858 16.25 15 16.25C15.4142 16.25 15.75 16.5858 15.75 17V17.5C15.75 19.0188 16.9812 20.25 18.5 20.25C20.0188 20.25 21.25 19.0188 21.25 17.5C21.25 15.9812 20.0188 14.75 18.5 14.75H4C3.58579 14.75 3.25 14.4142 3.25 14Z" fill="currentColor"/>
    <path opacity="0.7" d="M14.25 7.5C14.25 5.15279 16.1528 3.25 18.5 3.25C20.8472 3.25 22.75 5.15279 22.75 7.5C22.75 9.84721 20.8472 11.75 18.5 11.75H2C1.58579 11.75 1.25 11.4142 1.25 11C1.25 10.5858 1.58579 10.25 2 10.25H18.5C20.0188 10.25 21.25 9.01878 21.25 7.5C21.25 5.98122 20.0188 4.75 18.5 4.75C16.9812 4.75 15.75 5.98122 15.75 7.5V8C15.75 8.41421 15.4142 8.75 15 8.75C14.5858 8.75 14.25 8.41421 14.25 8V7.5Z" fill="currentColor"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="-5.4 0 98.4 98.4" xmlns="http://www.w3.org/2000/svg" className="weather-icon-svg">
    <g transform="translate(-822.7 -241.5)">
      <path d="M899.4,254.3H833.6a8.92,8.92,0,0,0-8.9,8.9V329a8.92,8.92,0,0,0,8.9,8.9h65.8a8.92,8.92,0,0,0,8.9-8.9V263.2A8.92,8.92,0,0,0,899.4,254.3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/>
      <line x2="21.2" transform="translate(842.6 283.7)" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/>
      <line x2="45.9" transform="translate(842.6 302)" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/>
      <line y2="19.6" transform="translate(853.6 243.5)" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/>
      <line y2="19.6" transform="translate(879.4 243.5)" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/>
    </g>
  </svg>
);

export default function WeatherCard({ lat, lon }) {
  const [today, setToday] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!lat || !lon) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const current = await getTodayWeather(lat, lon);
        const forecastData = await getForecast(lat, lon);
        
        setToday(current);
        setForecast(forecastData);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [lat, lon]);

  // OpenWeatherMap icon URL
  const iconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (loading) {
    return (
      <div className="weather-card-horizontal">
        <div className="skeleton-line"></div>
      </div>
    );
  }

  if (error || !today) {
    return (
      <div className="weather-card-horizontal">
        <div className="weather-error">
          <p>Unable to load weather data</p>
          <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-card-horizontal">
      {/* Current Weather Section */}
      <div className="current-section">
        <div className="current-main">
          <img src={iconUrl(today.icon)} alt="weather" />
          <div className="current-info">
            <span className="current-temp">{Math.round(today.temp)}°C</span>
            <span className="current-desc">{today.description}</span>
          </div>
        </div>
        <div className="current-stats">
          <span className="stat-item">
            <WaterIcon />
            Humidity: {today.humidity}%
          </span>
          <span className="stat-item">
            <WindIcon />
            Wind: {today.wind} km/h
          </span>
          <span className="stat-item">
            <CalendarIcon />
            Feels: {Math.round(today.feelsLike)}°C
          </span>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="forecast-section">
        <p className="section-label">8-Day Forecast</p>
        <div className="forecast-grid">
          {forecast.map((f, index) => {
            const weekday = formatWeekday(f.date);
            const isCurrentDay = isToday(f.date);
            
            return (
              <div 
                key={index} 
                className={`forecast-card ${isCurrentDay ? 'forecast-card-today' : ''}`}
              >
                <span className="forecast-day">{weekday}</span>
                <img src={iconUrl(f.icon)} alt="weather" />
                <div className="forecast-temp-range">
                  <span className="forecast-temp-high">{Math.round(f.tempMax)}°</span>
                  <span className="forecast-temp-low">{Math.round(f.tempMin)}°</span>
                </div>
                <span className="forecast-desc">{f.description}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}