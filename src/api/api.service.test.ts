import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { searchCities, getWeatherForecast, getLatLng } from './api';

jest.mock('rxjs/ajax', () => ({
  ajax: {
    getJSON: jest.fn(),
  },
}));

describe('searchCities', () => {
  it('should return the list of cities', (done) => {
    const query = 'London';
    const cities = [{
      description: 'London, United Kingdom',
      id: 'abc',
      place_id: 'def',
    }];

    (ajax.getJSON as jest.MockedFunction<typeof ajax.getJSON>).mockReturnValueOnce(of({ predictions: cities }));

    searchCities(query).subscribe((result: any) => {
      expect(result).toEqual(cities);
      done();
    });
  });
});

describe('getWeatherForecast', () => {
  it('should return the list of weather forecasts', (done) => {
    const lat = 51.5074;
    const lng = 0.1278;
    const weatherForecasts = [{
      dt: 1604804800,
      main: {
        temp: 280.15,
        feels_like: 279.36,
        temp_min: 280.15,
        temp_max: 280.15,
        pressure: 1007,
        sea_level: 1007,
        grnd_level: 1006,
        humidity: 93,
        temp_kf: 0,
      },
      weather: [{
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      }],
      clouds: {
        all: 0,
      },
      wind: {
        speed: 2.6,
        deg: 97,
      },
      sys: {
        pod: 'd',
      },
      dt_txt: '2021-11-08 15:00:00',
    }];

    (ajax.getJSON as jest.MockedFunction<typeof ajax.getJSON>).mockReturnValueOnce(of({ list: weatherForecasts }));

    getWeatherForecast(lat, lng).subscribe((result: any) => {
      expect(result).toEqual(weatherForecasts);
      done();
    });
  });
});

describe('getLatLng', () => {
  it('should return the latitude and longitude of the place', (done) => {
    const placeId = 1604804800;
    const place = {
      name: 'London',
      geometry: {
        location: {
          lat: 51.5074,
          lng: 0.1278
        }
      }
    };

    (ajax.getJSON as jest.MockedFunction<typeof ajax.getJSON>).mockReturnValueOnce(of({ result: place }));

    getLatLng(placeId).subscribe((result: any) => {
      expect(result).toEqual(place);
      done();
    });
  });
});
