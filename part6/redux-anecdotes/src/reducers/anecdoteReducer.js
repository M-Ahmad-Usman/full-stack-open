
import { createSlice } from '@reduxjs/toolkit'

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
      state.push(action.payload.anecdote)
      return state
    },
    setAnecdotes(state, action) {
      return action.payload.anecdotes
    }
  }
})

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer