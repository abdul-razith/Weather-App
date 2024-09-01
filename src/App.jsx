import { useState } from 'react';
import PropsTypes from "prop-types";
import './App.css'

/* Import images */
import clearSkyIcon from './assets/clear-sky.png';
import clearSkyIconN from './assets/clear-sky-night.png';
import fewCloudsIcon from './assets/few-clouds.png';
import fewCloudsIconN from './assets/few-clouds-night.png';
import scatteredCloudsIcon from './assets/scattered-clouds.png';
import scatteredCloudsIconN from './assets/scattered-clouds-night.png';
import brokenCloudsIcon from './assets/broken-clouds.png';
import brokenCloudsIconN from './assets/broken-clouds-night.png';
import showerRainIcon from './assets/shower-rain.png';
import showerRainIconN from './assets/shower-rain-night.png';
import rainIcon from './assets/rain.png';
import rainIconN from './assets/rain-night.png';
import thunderstormIcon from './assets/thunderstorm.png';
import thunderstormIconN from './assets/thunderstorm-night.png';
import snowIcon from './assets/snow.png';
import snowIconN from './assets/snow-night.png';
import mistIcon from './assets/mist.png';
import mistIconN from './assets/mist-night.png';

import humidityIcon from './assets/humidity.png';
import searchIcon from './assets/search.png';
import windIcon from './assets/wind.png';
import { useEffect } from 'react';

const WeatherDetails = ({icon, des, main, temp, city, country, lat, log, humidity, wind}) => {
  return(
    <>
      <div className="image">
        <img src={icon} alt="Image" />
      </div>
      <div className="sts">
        {main}
        <br />
        {des}
      </div>
      <div className="temp">
        {temp}°C
      </div>
      <div className="location">
        {city}
      </div>
      <div className="country">
        {country}
      </div>
      <div className="cord">
        <div>
          <span className='lat'>lati</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>log</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidityIcon" className='icon' />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">hum</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="windIcon" className='icon' />
          <div className="data">
            <div className="wind-speed">{wind}km/h</div>
            <div className="text">hum</div>
          </div>
        </div>
      </div>
    </>
  );
}
 
WeatherDetails.propsTypes= {
  icon: PropsTypes.string.isRequired,
  temp: PropsTypes.number.isRequired,
  city: PropsTypes.string.isRequired,
  country: PropsTypes.string.isRequired,
  lat: PropsTypes.number.isRequired,
  log: PropsTypes.number.isRequired,
  humidity: PropsTypes.number.isRequired,
  wind: PropsTypes.number.isRequired,
}

function App() {
  let api_key = "574fc30154820aebf9db01cd4a1bfa93"
  const [text, setText] = useState("chennai");

  const [icon, setIcon] = useState(clearSkyIcon);
  const [des, setDes] = useState("");
  const [main, setMain] = useState("");
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearSkyIcon, 
    "01n": clearSkyIconN,    
    "02d": fewCloudsIcon,    
    "02n": fewCloudsIconN,    
    "03d": scatteredCloudsIcon,   
    "03n": scatteredCloudsIconN,  
    "04d": brokenCloudsIcon,    
    "04n": brokenCloudsIconN,   
    "09d": showerRainIcon,   
    "09n": showerRainIconN,   
    "10d": rainIcon,
    "10n": rainIconN,
    "11d": thunderstormIcon,
    "11n": thunderstormIconN,
    "13d": snowIcon,
    "13n": snowIconN,
    "50d": mistIcon,
    "50n": mistIconN,
    };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();
      console.log(data);

      if(data.cod === "404"){
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);

      setDes(data.weather[0].description);
      setMain(data.weather[0].main);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode]);
      setCityNotFound(false);

    }catch(error){
      console.log(error.message);
      setError("An error occur while fetching the weather data.");
    }
    finally{
      setLoading(false);
    }
  }

  const handleCity = (e) => {
    setText(e.target.value);
  }
  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      search();
    }
  }
  useEffect(function(){
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className="input-container">
          <input type="text" className='cityInput' placeholder='Search city' onChange={handleCity} value={text} onKeyDown={handleKeyDown} />
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="search"/>
          </div>
        </div>

        {loading && <div className="loading-message">
          Loading...
        </div>}
        {error && <div className="error-message">
          {error}
        </div>}
        {cityNotFound && <div className="city-not-found">
          City not found
        </div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} /* main={main} */ des={des} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}

        <p className='copyright'>
          Desgined by <span>Abdul</span>
        </p>
      </div> 
    </>
  )
}

export default App
