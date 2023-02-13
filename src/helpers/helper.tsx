import { WeatherForecast } from "../modules/models";

export function processForecast(forecast: WeatherForecast, forecastByDay: { [day: string]: any }) {
    const date = new Date(forecast.dt_txt);
    const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
    if (!forecastByDay[day]) {
      forecastByDay[day] = {
        date: date.toDateString(),
        highestTemperature: forecast.main.temp,
        lowestTemperature: forecast.main.temp,
        highestFeelsLikeTemperature: forecast.main.feels_like,
        lowestFeelsLikeTemperature: forecast.main.feels_like,
        highestWindSpeed: forecast.wind.speed,
        lowestWindSpeed: forecast.wind.speed,
        weatherID: forecast.weather[0].id,
        weatherDescription: forecast.weather[0].description,
      };
    } else {
      forecastByDay[day].highestFeelsLikeTemperature = Math.max(forecastByDay[day].highestFeelsLikeTemperature, forecast.main.feels_like);
      forecastByDay[day].lowestFeelsLikeTemperature = Math.min(forecastByDay[day].lowestFeelsLikeTemperature, forecast.main.feels_like);
      forecastByDay[day].highestWindSpeed = Math.max(forecastByDay[day].highestWindSpeed, forecast.wind.speed);
      forecastByDay[day].lowestWindSpeed = Math.min(forecastByDay[day].lowestWindSpeed, forecast.wind.speed);
      forecastByDay[day].highestTemperature = Math.max(forecastByDay[day].highestTemperature, forecast.main.temp);
      forecastByDay[day].lowestTemperature = Math.min(forecastByDay[day].lowestTemperature, forecast.main.temp);
      forecastByDay[day].weatherID = forecast.weather[0].id;
      forecastByDay[day].weatherDescription = forecast.weather[0].description;
    }
}
  
export function removeYearFromDate(date: string): string {
    const dateArray = date.split(" ");
    return `${dateArray[0]}`;
}