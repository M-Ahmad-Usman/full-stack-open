import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {

  const anecdotes = useSelector(({ anecdotes }) => anecdotes )
  const filter = useSelector(({ filter }) => filter)

  const filteredAnecdotes = anecdotes
    .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))

  const dispatch = useDispatch()

  return (
    <div>
      {filteredAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(voteAnecdote(anecdote))}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
