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

const voteAnecdote = async (anecdote) => {
  
  const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  const response = await fetch(baseUrl + `/${votedAnecdote.id}`, { method: 'PATCH', body: JSON.stringify(votedAnecdote) })

  if (!response.ok) {
    console.error(response)
    throw new Error('Failed to vote anecdote')
  }

  return await response.json()
}

export default { getAll, createAnecdote, voteAnecdote }