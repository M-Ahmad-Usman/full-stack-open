import AnecdoteForm from './components/AnecdoteForm'
import Filter from './components/Filter'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {

  return (
    <div>
      <Notification></Notification>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList></AnecdoteList>
      <h2>create new</h2>
      <AnecdoteForm></AnecdoteForm>
    </div>
  )
}

export default App
