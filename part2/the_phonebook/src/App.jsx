import { useState, useEffect } from 'react'

import personService from "./services/persons"

import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Notification from "./components/Notification"

const App = () => {

	const [persons, setPersons] = useState([])

	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')

	const [searchText, setSearchText] = useState('')

	const [notificationMsg, setNotificationMsg] = useState('')

	const [isError, setIsError] = useState(false)

	useEffect(() => {
		personService.getAllPersons()
			.then(persons => {
				setPersons(persons)
				setIsError(false)
			})
			.catch(err => {
				showNotification(err.response.data.error, 5000)
				setIsError(true)
			})
	}, [])

	function showNotification(message, time = 2000) {
		setNotificationMsg(message)
		setTimeout(() => setNotificationMsg(''), time)
	}

	function validateNewPersonData() {
		setIsError(true)

		if (newName.trim() === '') {
			showNotification("Person's name is required", 2000)
			return
		}
		if (newNumber.trim() === '') {
			showNotification(`Phone Number is required for ${newName}`)
			return
		}
		// If the number contains invalid characters: allow only digits and hyphens
		if (/^[0-9\s-]+$/.test(newNumber) === false) {
			showNotification('Only digits (0-9) and "-" are allowed for number.')
			return
		}

		setIsError(false)

	}

	function updatePerson(oldPerson, newPerson) {
		personService.updatePerson({ ...oldPerson, number: newPerson.number })
			.then(updatedPerson => {
				setIsError(false)
				setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
				showNotification(`${updatedPerson.name}'s number has been updated`, 2000)
			})
			.catch(err => {
				setIsError(true)
				showNotification(err.response.data.error, 5000)
			})
	}

	function addPerson(event) {
		event.preventDefault()

		validateNewPersonData()

		if (isError) return

		const newPerson = {
			name: newName.trim(),
			number: newNumber.trim()
		}

		// If a person with submitted name already exists
		const personWithSameName = persons.find(person => person.name === newPerson.name);
		if (personWithSameName !== undefined) {

			const doOverwrite = confirm(`${personWithSameName.name} is already added to the phonebook, replace the old number with new one?`)

			if (doOverwrite) 
				updatePerson(personWithSameName, newPerson)
			else 
				setNewName('')

			return
		}

		personService.createPerson(newPerson)
			.then(newPerson => {
				setIsError(false)
				setPersons(persons.concat(newPerson))
				setNewName('')
				setNewNumber('')

				showNotification(`${newPerson.name} has been added to the phonebook.`, 2000)

			})
			.catch(err => {
				showNotification(err.response.data.error, 5000)
				setIsError(true)
			})
	}

	function deletePerson(id) {
		const deletePersonId = id;

		personService
			.deletePerson(deletePersonId)
			.then(deletedPerson => {
				setIsError(false)
				setPersons(persons.filter(person => person.id !== deletedPerson.id))
				showNotification(`${deletedPerson.name} has been deleted from the phonebook`, 2000)
			})
			.catch(() => {
				setIsError(true)
				showNotification(`This person has already been deleted from the server`, 2000)
			})
	}

	return (

		<div>
			<h2>Phonebook</h2>

			<Notification message={notificationMsg} isError={isError} />

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
				handleSubmit={addPerson}
			/>

			<h2>Numbers</h2>
			<Persons
				persons={persons}
				searchText={searchText}
				deletePerson={deletePerson}
			/>
			...
		</div>
	)
}

export default App