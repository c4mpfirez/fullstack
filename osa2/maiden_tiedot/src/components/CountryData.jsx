import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CountryData = ({ country }) => {
  console.log(`calling CountryData`)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    console.log(`fetching weather data for ${country.capital[0]} located in ${country.name.common}`)
    const api_key = import.meta.env.VITE_WEATHER_API_KEY
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
      })
  }, [country])

  const renderWeather = () => {
    if (!weather) {return null}
    return (
      <div>
        <h2>Weather in {weather.name}</h2>
        <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)} °C</p>
        <img
          alt={`Weather icon for ${weather.name}`}
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        />
        <p>Wind: {weather.wind.speed} m/s</p>
      </div>
    )
  }
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language, i) => <li key={i}>{language}</li>)}
      </ul>
      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        style={{ width: '150px', height: 'auto' }} 
      />
      {renderWeather()}
    </div>
  )
}

export default CountryData
