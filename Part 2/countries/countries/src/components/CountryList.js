import React from 'react'
import CountryDetails from './CountryDetails'

const CountryList = ({country, countries, setCountry}) => {
const searchResult = countries.filter(item => item.name.toLowerCase().includes(country.toLowerCase()))

    return (
        <div>
            {
                searchResult.length > 10 ?
                <p>Too many matches, specify another filter.</p>
                :
                searchResult.length === 1 ?
                <CountryDetails country={searchResult[0]} />
                :
                <ul style={{listStyle: 'none', padding: 0}}>
                    {
                        searchResult.map(result => (
                            <li key={result.name}>
                                {result.name} <button onClick={() => setCountry(result.name)}>Show</button>
                            </li>
                        ))
                    }
                </ul>
            }
        </div>
    )
}

export default CountryList