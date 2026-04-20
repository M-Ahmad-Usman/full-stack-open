
import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { showNotification, resetNotification } from "../reducers/notificationReducer"
import anecdoteService from "../services/anecdote"

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const renderNotification = ({ message, time }) => {
    dispatch(showNotification({ message }))
    setTimeout(() => dispatch(resetNotification()), time)
  }

  const create = async event => {

    event.preventDefault()

    if (!event.target.anecdote.value) return

    const anecdote = {
      content: event.target.anecdote.value,
      votes: 0
    }

    const createdAnecdote = await anecdoteService.createAnecdote(anecdote)

    const notification = {
      message: `Anecdote: "${anecdote.content}" created.`,
      time: 5000
    }
    renderNotification(notification)

    event.target.anecdote.value = ''

    dispatch(createAnecdote({ anecdote: createdAnecdote }))
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
