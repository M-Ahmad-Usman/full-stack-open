
import { useNavigate } from 'react-router-dom'

const Note = ({ note, toggleImportance, deleteNote }) => {

  const navigate = useNavigate()

  const handleDelete = (id) => {
    if (window.confirm(`Delete note "${note.content}"?`)) {
      deleteNote(id)
      navigate('/notes')
    }
  }

  if (!note)
    return null

  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={() => handleDelete(note.id)}>delete</button>
    </li>
  )
}
export default Note