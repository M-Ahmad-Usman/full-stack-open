
import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { showNotification, resetNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const renderNotification = ({ message, time }) => {
    dispatch(showNotification({ message }))
    setTimeout(() => dispatch(resetNotification()), time)
  }

  const create = async event => {

    event.preventDefault()

    if (!event.target.anecdote.value) return

    const anecdoteData = {
      content: event.target.anecdote.value,
      votes: 0
    }

    event.target.anecdote.value = ''

    dispatch(createAnecdote(anecdoteData))

    const notification = {
      message: `Anecdote: "${anecdoteData.content}" created.`,
      time: 5000
    }
    renderNotification(notification)
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
