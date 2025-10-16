
const Persons = props => {

    const { persons, searchText, deletePerson } = props

    const renderedPersons = persons
        .filter(person => person.name.toLowerCase().includes(searchText.toLowerCase()))
        .map(person => {

            return (
                <div key={person.id}>
                    <span>{person.name} {person.number}</span>
                    <button onClick={() => deletePerson(person.id)}>Delete</button>
                </div>
            )
        })

    return renderedPersons
}

export default Persons
