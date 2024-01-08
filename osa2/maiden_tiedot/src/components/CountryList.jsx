import React from 'react';

const CountryList = ({ countries, onShowCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  return (
    <div>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => onShowCountry(country)}>Show</button>
        </div>
      ))}
    </div>
  )
}

export default CountryList
