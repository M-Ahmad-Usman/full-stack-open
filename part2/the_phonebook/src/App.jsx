import { useState } from 'react'

const App = () => {

	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas' }
	])

	const [newName, setNewName] = useState('')

	function handleSubmit(event) {
		event.preventDefault();

		if (newName.trim() === '') return;

		setPersons(persons.concat({ name: newName }));
		setNewName("");
	}

	return (

		<div>
			<h2>Phonebook</h2>
			<form onSubmit={handleSubmit}>
				<div>
					name: <input value={newName} onChange={e => setNewName(e.target.value)} />
				</div>
				<div>
					<button type="submit">add</button>
				</div>
			</form>
			<h2>Numbers</h2>

			{persons.map(person => <span key={person.name}>{person.name}<br /></span>)}
			...
		</div>
	)
}

export default App