import { useState, useEffect } from 'react'
import Note from './components/Note'

import noteService from './services/notes'

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteService
      .getAll()
      .then(response => setNotes(response.data));
  }, [])

  console.log('render', notes.length, 'notes')

  const toggleImportanceOf = id => {

    const note = notes.find(n => n.id === id)

    // Create a new shallow copy
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(response => setNotes(notes.map(note => note.id === id ? response.data : note)))
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = event => {
    event.preventDefault()

    const note = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(note)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App