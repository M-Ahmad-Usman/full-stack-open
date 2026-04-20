const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  const anecdotes = await response.json()
  return anecdotes
}

const createAnecdote = async (anecdote) => {

  const response = await fetch(baseUrl, { method: 'POST', body: JSON.stringify(anecdote) })

  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }

  const createdAnecdote = await response.json()
  return createdAnecdote
}

export default { getAll, createAnecdote }