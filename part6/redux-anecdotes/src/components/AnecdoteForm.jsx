
import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { showNotification, resetNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const renderNotification = ({ message, time }) => {
    dispatch(showNotification({ message }))
    setTimeout(() => dispatch(resetNotification()), time)
  }

  const create = event => {

    event.preventDefault()

    const content = event.target.anecdote.value
    if (!content.trim()) return

    const notification = {
      message: `Anecdote: "${content}" created.`,
      time: 5000
    }
    renderNotification(notification)

    event.target.anecdote.value = ''

    dispatch(createAnecdote({ content }))
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
