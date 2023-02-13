import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { City, WeatherForecast, Place } from "../modules/models";

  interface ApiService {
    searchCities(query: string): Observable<City[]>;
    getWeatherForecast(lat: number, lng: number): Observable<WeatherForecast[]>;
    getLatLng(placeId: number): Observable<Place>;
  }
  
  class OpenWeatherApiService implements ApiService {
    private WEATHER_API_KEY = '9a194699b7e7e79b0029f89e43c161ce';
    private GOOGLE_API = 'AIzaSyDiKmRh2vEg2hiV1ZIVeyNlxPjVegpChvE';
    
    searchCities(query: string): Observable<City[]> {
      return ajax.getJSON<{ predictions: City[] }>(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=(cities)&key=${this.GOOGLE_API}&amp`).pipe(
        map(response => response.predictions),
      );
    }

    getWeatherForecast(lat: number, lng: number): Observable<WeatherForecast[]> {
      return ajax.getJSON<{ list: WeatherForecast[] }>(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${this.WEATHER_API_KEY}`).pipe(
        map(response => response.list),
      );
    }
    
    getLatLng(placeId: number): Observable<Place> {
      return ajax.getJSON<{ result: Place }>(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,geometry&key=${this.GOOGLE_API}`).pipe(
        map(response => response.result),
      );
    }
  }
  
  export const apiService = new OpenWeatherApiService();
  
  export const searchCities = (query: string) => apiService.searchCities(query);
  export const getWeatherForecast = (lat: number, lng: number) => apiService.getWeatherForecast(lat, lng);
  export const getLatLng = (placeId: number) => apiService.getLatLng(placeId);