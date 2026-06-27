// routed-anecdotes/src/hooks/index.js

import { useState, useContext } from 'react'
import { AnecdoteContext } from '../context/AnecdoteContext'

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

export const useAnecdotes = ()  => {
  const context = useContext(AnecdoteContext);

  if (context === undefined || context === null) {
    throw new Error('useAnecdotes must be used within a AnecdoteProvider');
  }

  return context;
}