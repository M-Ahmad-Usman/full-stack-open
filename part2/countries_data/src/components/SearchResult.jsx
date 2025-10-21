
// Component
import Country from "./Country"

const SearchResult = props => {

	const { searchResult } = props

	if (!searchResult) return null

	// If no result is found
	if (searchResult.length === 0) 
		return 'No country found'

	// If results are more than 10
	else if (searchResult.length > 10)
		return 'Too many matches, specify another filter'

	// If results are fewer than 10 but more than 1
	else if (searchResult.length < 11 && searchResult.length > 1)
		return searchResult.map(country => <li key={country.tld}>{country.name.common}</li>)

	// If there is only one match
	const [country] = searchResult;
	return <Country country={country}/>
}

export default SearchResult
