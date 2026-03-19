import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {

  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return anecdotes
      .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const dispatch = useDispatch()

  const vote = id => dispatch(voteAnecdote(id))

  return (
    <div>
      {anecdotes.map(a => (
        <div key={a.id}>
          <div>{a.content}</div>
          <div>
            has {a.votes}
            <button onClick={() => vote(a.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
