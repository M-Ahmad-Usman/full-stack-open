
const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {

  const { title, author, url } = request.body

  if (!title) return response.status(400).json({ error: `Blog's title is required` })
  if (!author) return response.status(400).json({ error: 'Author is required' })
  if (!url) return response.status(400).json({ error: `Blog's url is required` })

  const blog = new Blog({ title, author, url, likes: request.body.likes || 0 })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const resultantBlog = await Blog.findOne({ _id: id })

  if (!resultantBlog) return response.status(404).json({
    error: 'No blog available with given id'
  })

  response.json(resultantBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (!deletedBlog) return response.status(404).json({ error: 'No blog available with given id' })

  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id

  if (!request.body) return response.status(400)
    .json({
      error: 'Atleast one valid value is required for a field.'
    })

  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(id)

  if (!blog) return response.status(404).json({ error: 'No blog available with given id' })

  blog.title = title.trim() || blog.title
  blog.author = author.trim() || blog.author
  blog.url = url.trim() || blog.url
  blog.likes = likes || blog.likes

  await blog.save()

  response.json(blog)
})

module.exports = blogRouter