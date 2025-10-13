
const Persons = props => {

    const { persons, searchText } = props

    const renderedPersons = persons
        .filter(person => person.name.toLowerCase().includes(searchText.toLowerCase()))
        .map(person => <span key={person.number}>{person.name} {person.number}<br /></span>)

    return renderedPersons
}

export default Persons
