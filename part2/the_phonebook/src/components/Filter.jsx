

const Filter = props => {

    const { searchText, setSearchText } = props
    
    return (
        <div>
            filter shown with: <input value={searchText} onChange={e => setSearchText(e.target.value)} />
        </div>
    )
}

export default Filter
