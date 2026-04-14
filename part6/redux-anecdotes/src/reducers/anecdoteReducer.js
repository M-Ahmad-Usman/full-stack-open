
import { createSlice } from '@reduxjs/toolkit'

// Utitilies

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      
      const anecdote = state.find(a => a.id === action.payload.id)

      anecdote.votes++

      return state
    },
    createAnecdote(state, action) {
      state.push(asObject(action.payload.content))
      return state
    },
    setAnecdotes(state, action) {
      return action.payload.anecdotes
    }
  }
})

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer