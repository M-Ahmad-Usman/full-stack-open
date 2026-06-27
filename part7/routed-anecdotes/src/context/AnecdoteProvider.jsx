// routed-anecdotes/src/context/AnecdoteProvider.jsx

import { useState, useEffect } from 'react'
import { AnecdoteContext } from './AnecdoteContext'
import anecdoteService from '../services/anecdotes'

export function AnecdoteProvider({ children }) {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then(anecdotes => setAnecdotes(anecdotes))
  }, [])

  const addAnecdote = async anecdoteData => {
    const newAnecdote = await anecdoteService.createNew(anecdoteData)
    setAnecdotes(anecdotes.concat(newAnecdote))
  }

  const deleteAnecdote = async deleteAnecdoteId => {
    const deletedAnecdote = await anecdoteService.deleteAnecdote(deleteAnecdoteId)
    setAnecdotes(anecdotes.filter(anecdote => anecdote.id !== deletedAnecdote.id))
  }

  return (
    <AnecdoteContext.Provider value={{ anecdotes, addAnecdote, deleteAnecdote }}>
      {children}
    </AnecdoteContext.Provider>
  );
}