import axios from 'axios'

export const fetchCountries = () => {
  console.log('fetching countries')
  return axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => response.data)
}
export const fetchWeather = (capital, api_key) => {
  console.log('fetching weather data')
  return axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
    .then(response => response.data)
    .catch(error => console.error('api call limit reached', error))
}
