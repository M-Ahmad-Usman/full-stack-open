import { useState } from 'react'

const App = () => {

	const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456'},
    { name: 'Ada Lovelace', number: '39-44-5323523'},
    { name: 'Dan Abramov', number: '12-43-234345'},
    { name: 'Mary Poppendieck', number: '39-23-6423122'}
  ])

	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')

	const [searchText, setSearchText] = useState('')

	function handleSubmit(event) {
		event.preventDefault()

		if (newName.trim() === '') {
			alert("Person's name is required!")
			return
		}

		if (newNumber.trim() === '') {
			alert(`Phone Number is required for ${newName}`)
			return
		}

		// If person with submitted number already exists
		const existingPerson = persons.find(person => person.number === newNumber);
		if (existingPerson !== undefined) {
			alert(`${newNumber} is already added to the phonebook with name ${existingPerson.name}.`)
			return
		}

		// If the number contains invalid characters: allow only digits and hyphens
		if (/^[0-9\s-]+$/.test(newNumber) === false) {
			alert('Only digits (0-9) and "-" are allowed for number.')
			return
		}

		const newPerson = {
			name: newName.trim(),
			number: newNumber.trim()
		}

		setPersons(persons.concat(newPerson))
		setNewName('')
		setNewNumber('')
	}

	return (

		<div>
			<h2>Phonebook</h2>

			<div>
				filter shown with: <input value={searchText} onChange={e => setSearchText(e.target.value)} />
			</div>

			<h2>add a new</h2>
			<form onSubmit={handleSubmit}>
				<div>
					name: <input value={newName} onChange={e => setNewName(e.target.value)} />
				</div>
				<div>
					number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)}/>
				</div>
				<div>
					<button type="submit">add</button>
				</div>
			</form>
			<h2>Numbers</h2>

			{persons
				.filter(person => person.name.toLowerCase().includes(searchText.toLowerCase()))
				.map(person => <span key={person.number}>{person.name} {person.number}<br /></span>)}
			...
		</div>
	)
}

export default App