
const Blog = require('../models/blog')

const removeProperty = (document, property) => {
  if (!property) return null

  delete document[property]
  return document
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = () => '6922f4397e0fe27d8c421713'


const helper = { removeProperty, blogsInDB, nonExistingId }

module.exports = helper