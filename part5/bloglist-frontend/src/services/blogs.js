import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog) => {

  const config = {
    headers: { Authorization: token }
  }

  const { data: createdBlog } = await axios.post(baseUrl, blog, config)
  return createdBlog
}

const like = async (blog) => {
  const { data: blogWithUpdatedLikes } = await axios.put(`${baseUrl}/${blog.id}`)
  return blogWithUpdatedLikes
}

export default { 
  getAll,
  setToken,
  create,
  like
}