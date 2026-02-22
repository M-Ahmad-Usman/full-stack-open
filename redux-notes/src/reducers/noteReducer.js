
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return [...state, action.payload]
    case 'TOGGLE_IMPORTANCE': {
      const noteId = action.payload.id
      const noteToChange = state.find(note => note.id === noteId)

      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }

      return state.map(note => note.id === noteId ? changedNote : note)
    }
    default:
      return state
  }
}

export default noteReducer