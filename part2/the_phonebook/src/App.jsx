import { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"

const App = () => {

	const [persons, setPersons] = useState([])

	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')

	const [searchText, setSearchText] = useState('')

	useEffect(() => {
		axios
			.get('http://localhost:3001/persons')
			.then(response => setPersons(response.data))
	}, [])

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
			<Filter
				searchText={searchText}
				setSearchText={setSearchText}
			/>

			<h2>add a new</h2>
			<PersonForm
				newName={newName}
				setNewName={setNewName}
				newNumber={newNumber}
				setNewNumber={setNewNumber}
				handleSubmit={handleSubmit}
			/>

			<h2>Numbers</h2>
			<Persons
				persons={persons}
				searchText={searchText}
			/>
			...
		</div>
	)
}

export default App