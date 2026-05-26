
import { useParams, useNavigate } from 'react-router-dom'

const Note = ({ notes, toggleImportance, deleteNote }) => {

  const id = useParams().id
  const note = notes.find(n => n.id === id)

  const navigate = useNavigate()

  const handleDelete = () => {
    if (window.confirm(`Delete note "${note.content}"?`)) {
      deleteNote(id)
      navigate('/notes')
    }
  }

  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={handleDelete}>delete</button>
    </li>
  )
}
export default Note