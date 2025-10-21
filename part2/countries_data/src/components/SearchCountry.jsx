import React from 'react'

const SearchCountry = props => {

    const { searchText, setSearchText } = props

    return (

        <form>
            <label htmlFor="find-countries">Find Countries: </label>
            <input
                type="search"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                name="find-countries"
                id="find-countries"
            />
        </form>
    )
}

export default SearchCountry
