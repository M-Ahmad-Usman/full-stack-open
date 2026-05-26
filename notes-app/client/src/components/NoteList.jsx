
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Components
import Notification from './Notification'
import LoginForm from './LoginForm'
import Togglable from './Toggleable'

// Services
import noteService from '../services/notes'

const NoteList = ({ notes }) => {

  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  // Verify whether user is logged in or not
  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const onSuccessfullLogin = (loggedInUser) => {
    setUser(loggedInUser)
    localStorage.setItem('loggedNoteappUser', JSON.stringify(loggedInUser))
    noteService.setToken(loggedInUser.token)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {/* If user isn't logged in then show button to open login form */}
      {
        !user &&
        <Togglable buttonLabel='login'>
          <LoginForm onSuccessfullLogin={onSuccessfullLogin} setErrorMessage={setErrorMessage} />
        </Togglable>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NoteList