import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { initializeAnecdotes } from './reducers/anecdoteReducer'
import AnecdoteForm from './components/AnecdoteForm'
import Filter from './components/Filter'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {

  const dispatch = useDispatch()

  useEffect(() => { dispatch(initializeAnecdotes()) }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      
      <Filter />
      <AnecdoteList />

      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  )
}

export default App
