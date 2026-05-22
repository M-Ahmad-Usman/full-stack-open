
import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const create = async event => {

    event.preventDefault()

    if (!event.target.anecdote.value) return

    const anecdoteData = {
      content: event.target.anecdote.value,
      votes: 0
    }

    event.target.anecdote.value = ''

    dispatch(createAnecdote(anecdoteData))
  }

  return (
    <form onSubmit={create}>
      <div>
        <input name='anecdote' />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
