import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { showNotification, resetNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {

  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return anecdotes
      .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const dispatch = useDispatch()

  const renderNotification = ({ message, time }) => {
    dispatch(showNotification({ message }))
    setTimeout(() => dispatch(resetNotification()), time)
  }

  const vote = (anecdote) => {

    const notification = {
      message: `You voted "${anecdote.content}"`,
      time: 5000
    }
    renderNotification(notification)

    dispatch(voteAnecdote({ id: anecdote.id }))
  }

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
