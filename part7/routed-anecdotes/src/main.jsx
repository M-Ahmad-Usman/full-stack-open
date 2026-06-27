// routed-anecdotes/src/main.jsx

import { createRoot } from 'react-dom/client'
import { AnecdoteProvider } from './context/AnecdoteProvider.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AnecdoteProvider>
    <App />
  </AnecdoteProvider>
)
