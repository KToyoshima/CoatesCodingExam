import React, { useState, useEffect } from 'react';
import { of, Subject } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { searchCities, getWeatherForecast, getLatLng } from './api/api';
import { processForecast, removeYearFromDate } from './helpers/helper';
import { City, Place, FutureForcast } from './modules/models';
import { imageMap } from './modules/imageMap';
import './css/styles.css'
import './weather-icons-master/css/weather-icons.css'
import './weather-icons-master/css/weather-icons-wind.css'

const App = () => {
  const [city, setCity] = useState<string>('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [currentForecast, setCurrentForecast] = useState<FutureForcast | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('');
  const [futureForecast, setFutureForecast] = useState<FutureForcast[] | null>(null);
  const [locationCoordinates, setLocationCoordinates] = useState<Place | null>(null);
  const [inputSubject, setInputSubject] = useState(() => new Subject<string>());

  useEffect(() => {
    const inputSubscription = inputSubject
      .pipe(
        debounceTime(500),
        switchMap((value) => (value ? searchCities(value) : of([])))
      )
      .subscribe((cities) => {
        setSuggestions(cities);
      });
  
    return () => {
      inputSubscription.unsubscribe();
    };
  }, [inputSubject]);

  useEffect(() => {
    const weatherSubscription = locationCoordinates && getWeatherForecast(locationCoordinates.geometry.location.lat, locationCoordinates.geometry.location.lng).subscribe((weatherForecast) => {
      let forecastByDay: { [day: string]: any } = {};
      weatherForecast.forEach((forecast) => {
        processForecast(forecast, forecastByDay);
      });
      let x = Object.values(forecastByDay)
      setFutureForecast(Object.values(forecastByDay));
      setCurrentForecast(x[0])
    });
  
    return () => {
      weatherSubscription && weatherSubscription.unsubscribe();
    };
  }, [locationCoordinates]);
  
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
    inputSubject.next(event.target.value);
  };

  const handleSelect = (selectedCity: City) => {
    setCity(selectedCity.description);
    setCurrentCity(selectedCity.description);
    setSuggestions([]);
    getLatLng(selectedCity.place_id).subscribe((place) => {
      setLocationCoordinates(place)
    });
  };

  const handleSeletChangeCurrentForcast = (selectedForcast: FutureForcast) => {
    setCurrentForecast(selectedForcast)
  }
  
  return ( 
    <div className='current-forecast'>
      <div className="left-section">
        <div style={{position: 'relative'}}>
          <input type="text" className="input" value={city} onChange={handleInput} placeholder="Search your city"/>
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion) => (
                <li key={suggestion.place_id} className="suggestion" onClick={() => handleSelect(suggestion)}>
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='forcast'>
          {currentForecast && (
            <div>
              <i className={`wi wi-owm-${currentForecast.weatherID} weather-icon`} />
              <span className='temperature'> {(currentForecast.highestTemperature - 273.15).toFixed(1)}<i className={'wi wi-celsius'} /> |</span>
              <span className='temperature'> {(currentForecast.lowestTemperature - 273.15).toFixed(1)}<i className={'wi wi-celsius'} /></span>
              <p className='description'>{currentForecast.weatherDescription}</p>
              <p className='date'>{currentForecast.date}</p>
              <p className='city'>{currentCity}</p>
            </div>
          )}
        </div>

        <div className='forcast-five-days'>
          <div className='body'>
            {futureForecast &&
              futureForecast.map((item) => {
                return (
                  <div key={item.date} className='cards' onClick={() => handleSeletChangeCurrentForcast(item)}>
                    <p className='date'>{removeYearFromDate(item.date)}</p>
                    <i className={`wi wi-owm-${item.weatherID} weather-icon`} />
                    <div>
                      <span className='temperature'> {(item.highestTemperature - 273.15).toFixed(1)}<i className={'wi wi-celsius'} /> |</span>
                      <span className='temperature'> {(item.lowestTemperature - 273.15).toFixed(1)}<i className={'wi wi-celsius'} /></span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      
      <div className="right-section">
        {currentForecast && (
          <img 
            src={
              (() => {
                switch (currentForecast.weatherDescription) {
                  case 'clear sky':
                    return imageMap['clear sky'];
                  case 'few clouds':
                    return imageMap['few clouds'];
                  case 'scattered clouds':
                    return imageMap['scattered clouds'];
                  case 'mist':
                    return imageMap['mist'];
                  case 'shower rain':
                    return imageMap['shower rain'];
                  case 'moderate rain':
                    return imageMap['shower rain'];
                  case 'rain':
                    return imageMap['rain'];
                  case 'thunderstorm':
                    return imageMap['thunderstorm'];
                  case 'snow':
                    return imageMap['snow'];
                  default:
                    return imageMap.default;
                }
              })()
            } 
            alt="random" 
          />
        )}
      </div>
    </div>
  );
};

export default App;
