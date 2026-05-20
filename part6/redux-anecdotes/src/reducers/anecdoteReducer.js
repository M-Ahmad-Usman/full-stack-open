
import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdote'

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

const { setAnecdotes } = anecdoteSlice.actions

export function initializeAnecdotes () {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    
    dispatch(setAnecdotes({ anecdotes }))
  }
} 

export const { voteAnecdote, createAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer