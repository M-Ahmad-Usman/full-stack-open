
// React
import { useState, useEffect } from 'react'
// Components
import SearchCountry from './components/SearchCountry'
import SearchResult from './components/SearchResult'
// Services
import countryService from './services/countries'

function App() {

  const [searchText, setSearchText] = useState('')

  const [countries, setCountries] = useState(null)
  const [searchResult, setSearchResult] = useState(null)

  // Load data at first render
  useEffect(() => {
    countryService
      .getAllCountries()
      .then(data => setCountries(data))
      .catch(err => console.error(err.message))
  }, [])

  // Show searched Data
  useEffect(() => {

    if (searchText.trim() === "") {
      setSearchResult('')
      return
    }

    const matchedCountries =
      countries.filter(country => {
        const searchedTerm = searchText.toLowerCase()
        const countryCommonName = country.name.common.toLowerCase()

        return countryCommonName.includes(searchedTerm)

      })

    setSearchResult(matchedCountries)

  }, [searchText])

  return (

    <>
      <SearchCountry
        searchText={searchText}
        setSearchText={setSearchText}  
      />

      <SearchResult 
        searchResult={searchResult}
        setSearchResult={setSearchResult}
      />      
    </>
  )
}

export default App
