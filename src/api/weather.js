function interpretWeatherCode(code) {
  if (code === 0) return { description: "Clear Sky", icon: "01d" };
  if (code === 1) return { description: "Mainly Clear", icon: "01d" };
  if (code === 2) return { description: "Partly Cloudy", icon: "02d" };
  if (code === 3) return { description: "Overcast Clouds", icon: "04d" };
  if ([45, 48].includes(code)) return { description: "Foggy", icon: "50d" };
  if ([51, 53, 55].includes(code)) return { description: "Drizzle", icon: "09d" };
  if ([61, 63, 65].includes(code)) return { description: "Rain", icon: "10d" };
  if ([71, 73, 75].includes(code)) return { description: "Snow", icon: "13d" };
  if (code === 77) return { description: "Snow Grains", icon: "13d" };
  if ([80, 81, 82].includes(code)) return { description: "Rain Showers", icon: "09d" };
  if ([85, 86].includes(code)) return { description: "Snow Showers", icon: "13d" };
  if ([95, 96, 99].includes(code)) return { description: "Thunderstorm", icon: "11d" };
  return { description: "Unknown", icon: "01d" };
}


export async function getTodayWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index,apparent_temperature&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current;
    const { description, icon } = interpretWeatherCode(c.weather_code);

    return {
      temp: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      description,
      icon,
      humidity: c.relative_humidity_2m,
      wind: c.wind_speed_10m,
      uv: c.uv_index ?? "N/A",
    };
  } catch (err) {
    console.error("Open-Meteo current weather error:", err);
    return null;
  }
}

/**
 * Get 8-day daily forecast
 */
export async function getForecast(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max,wind_speed_10m_max,precipitation_sum&timezone=auto&forecast_days=8`;
    const res = await fetch(url);
    const data = await res.json();
    const d = data.daily;

    return d.time.map((date, i) => {
      const { description, icon } = interpretWeatherCode(d.weather_code[i]);
      return {
        date,
        temp: d.temperature_2m_max[i],
        tempMax: d.temperature_2m_max[i],
        tempMin: d.temperature_2m_min[i],
        description,
        icon,
        uv: d.uv_index_max[i],
        wind: d.wind_speed_10m_max[i],
        precipitation: d.precipitation_sum[i],
      };
    });
  } catch (err) {
    console.error("Open-Meteo forecast error:", err);
    return [];
  }
}