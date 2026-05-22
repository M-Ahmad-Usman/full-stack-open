
import { createSlice } from '@reduxjs/toolkit'
import { showNotification } from './notificationReducer'
import anecdoteService from '../services/anecdote'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdoteVotes(state, action) {
      const anecdote = action.payload
      const updatedAnecdote = { ...anecdote, votes: anecdote.votes }
      return state.map(a => (a.id !== updatedAnecdote.id ? a : updatedAnecdote))
    },
    createAnecdote(state, action) {
      return state.concat(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})


export function initializeAnecdotes() {
  const setAnecdotesAction = anecdoteSlice.actions.setAnecdotes

  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()

    dispatch(setAnecdotesAction(anecdotes))
  }
}

export function createAnecdote(anecdoteData) {
  const createAnecdoteAction = anecdoteSlice.actions.createAnecdote

  return async dispatch => {

    try {
      const newAnecdote = await anecdoteService.createAnecdote(anecdoteData)
      dispatch(createAnecdoteAction(newAnecdote))
      dispatch(showNotification(`Anecdote: "${newAnecdote.content}" created.`, 5 ))
    }
    catch (err) {
      dispatch(showNotification(`Failed to create anecdote. Something went wrong`, 5 ))
      console.error(err)
    }
  }
}

export function voteAnecdote(anecdote) {
  const updateAnecdoteVotesAction = anecdoteSlice.actions.updateAnecdoteVotes
  
  return async dispatch => {

    dispatch(updateAnecdoteVotesAction({ ...anecdote, votes: anecdote.votes + 1 }))

    try {
      await anecdoteService.voteAnecdote(anecdote)
      dispatch(showNotification(`you voted '${anecdote.content}'`, 2))
    }
    catch (err) {
      // Revert back to original state
      dispatch(updateAnecdoteVotesAction(anecdote))
      dispatch(showNotification(`Failed to vote anecdote`, 2))
      console.error(err)
      return
    }
  }
}

export default anecdoteSlice.reducer