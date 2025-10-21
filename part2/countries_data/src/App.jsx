
// React
import { useState, useEffect } from 'react'
// Libraries
import axios from 'axios'
// Components
import SearchCountry from './components/SearchCountry'
import SearchResult from './components/SearchResult'

function App() {

  const [searchText, setSearchText] = useState('')

  const [countries, setCountries] = useState(null)
  const [searchResult, setSearchResult] = useState(null)

  // Load data at first render
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(res => setCountries(res.data))
      .catch(err => console.error(err.message))
  }, [])

  // Show searched Data
  useEffect(() => {

    if (searchText.trim() === "") return

    const matchedCountries =
      countries.filter(country => {
        const searchedTerm = searchText.toLowerCase()
        const countryCommonName = country.name.common.toLowerCase()

        return countryCommonName.includes(searchedTerm)

      })

    setSearchResult(matchedCountries)

  }, [searchText])

  
  if (!countries) return <p>Loading</p>

  return (

    <>
      <SearchCountry
        searchText={searchText}
        setSearchText={setSearchText}  
      />

      <SearchResult 
        searchResult={searchResult}
      />      
    </>
  )
}

export default App
