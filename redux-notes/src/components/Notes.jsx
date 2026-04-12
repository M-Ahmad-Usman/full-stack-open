import { useDispatch, useSelector } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'
import noteService from '../services/notes'

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}


const Notes = () => {

  const updateImportance = async (note) => {
    dispatch(toggleImportanceOf(note.id))
    try {
      await noteService.updateImportanceOf(note.id, !note.important)
    }
    catch(e) {
      // revert
      dispatch(toggleImportanceOf(note.id))
      throw new Error(e)
    }
  }

  const dispatch = useDispatch()
  const notes = useSelector(({ filter, notes }) => {
    if (filter === 'ALL')
      return notes
    
    return filter === 'IMPORTANT'
      ? notes.filter(n => n.important)
      : notes.filter(n => !n.important)
  })

  return (
    <ul>
      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          handleClick={() => updateImportance(note)}
        />
      ))}
    </ul>
  )
}

export default Notes