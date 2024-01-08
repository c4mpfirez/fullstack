import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryData from './components/CountryData.jsx'
import CountryList from './components/CountryList.jsx'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase())
    setSelectedCountry(null)
  }
  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }
  const filteredCountries = searchTerm
    ? countries.filter(country => country.name.common.toLowerCase().includes(searchTerm))
    : countries

  return (
    <div>
      find countries <input value={searchTerm} onChange={handleSearchChange} />
      <CountryList countries={filteredCountries} onShowCountry={handleShowCountry} />
      {selectedCountry && <CountryData country={selectedCountry} />}
    </div>
  )
}

export default App

// 2.20 valmis

