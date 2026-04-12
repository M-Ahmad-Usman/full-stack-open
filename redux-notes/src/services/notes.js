const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) 
    throw new Error('Failed to fetch notes')

  return await response.json()
}

const createNew = async (content) => {

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}

const updateImportanceOf = async (id, updatedImportance) => {
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ important: updatedImportance })
  }
  
  const response = await fetch(baseUrl + `/${id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update importance note: ', id)
  }

  return (await response).json()
}

export default { getAll, createNew, updateImportanceOf }