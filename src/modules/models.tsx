export interface City {
    id: number;
    name: string;
    place_id: number;
    description: string;
}
  
export interface WeatherForecast {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      feels_like: number;
    };
    weather: [
      {
        description: string;
        id: string;
      }
    ];
    wind: {
      deg: number;
      gust: number;
      speed: number;
    };
}
  
export interface Place {
    geometry: {
      location: {
        lat: number,
        lng: number
      },
      viewport: object
    },
    name: string;
}
  
export interface FutureForcast {
    date: string;
    highestTemperature: number;
    lowestTemperature: number;
    highestFeelsLikeTemperature: number;
    lowestFeelsLikeTemperature: number;
    highestWindSpeed: number;
    lowestWindSpeed: number;
    weatherID: number;
    weatherDescription: string;
}

