
import { useState } from 'react'
import { useEffect } from 'react'

import anecdoteService from '../services/anecdotes'

export const useField = type => {
  const [value, setValue] = useState('')

  const onChange = event => {
    setValue(event.target.value)
  }

  const reset = () => { setValue('') }

  return {
    type,
    value,
    reset,
    onChange
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = anecdoteData => {
    anecdoteService.createNew(anecdoteData)
      .then(createdAnecdote => setAnecdotes(anecdotes.concat(createdAnecdote)))
  }

  const deleteAnecdote = deleteAnecdoteId => {
    anecdoteService.deleteAnecdote(deleteAnecdoteId)
      .then(() => setAnecdotes(anecdotes.filter(anecdote => anecdote.id !== deleteAnecdoteId)))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}