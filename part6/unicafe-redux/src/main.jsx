import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducers/counterReducer'

const store = createStore(counterReducer)

const dispatchAction = (type) => store.dispatch({ type })

const App = () => {
  return (
    <div>
      <button onClick={ () => dispatchAction('GOOD') }>good</button>
      <button onClick={ () => dispatchAction('OK') }>ok</button>
      <button onClick={ () => dispatchAction('BAD') }>bad</button>
      <button onClick={ () => dispatchAction('RESET') }>reset stats</button>
      <div>good { store.getState().good }</div>
      <div>ok { store.getState().ok } </div>
      <div>bad { store.getState().bad } </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
