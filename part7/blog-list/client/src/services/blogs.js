import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const { data: createdBlog } = await axios.post(baseUrl, blog, config)
  return createdBlog
}

const likeBlog = async (likeBlogId) => {
  const { data: blogWithUpdatedLikes } = await axios.patch(
    `${baseUrl}/like/${likeBlogId}`,
  )
  return blogWithUpdatedLikes
}

const removeBlog = async (removeBlogId) => {
  const config = {
    headers: { Authorization: token },
  }
  const { data: deletedBlog } = await axios.delete(
    `${baseUrl}/${removeBlogId}`,
    config,
  )
  return deletedBlog
}

export default {
  getAll,
  setToken,
  create,
  removeBlog,
  likeBlog,
}
