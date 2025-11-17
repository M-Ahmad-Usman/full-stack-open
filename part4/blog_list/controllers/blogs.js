
const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response) => {

  const { title, author, url } = request.body

  if (!title) return response.status(400).json({ error: `Blog's title is required` })
  if (!author) return response.status(400).json({ error: 'Author is required' })
  if (!url) return response.status(400).json({ error: `Blog's url is required` })

  const blog = new Blog({ title, author, url, likes: 0 })

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogRouter