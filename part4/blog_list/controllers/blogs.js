
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
const User = require('../models/user')

// Middlewares
const extractTokenPayload = middleware.extractTokenPayload
const verifyContentType = middleware.verifyContentType('application/json')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post(
  '/',
  verifyContentType,
  extractTokenPayload,
  async (request, response) => {

    const { tokenPayload } = request
    const { title, author, url } = request.body

    if (!tokenPayload.userId)
      return response.status(401).json({ error: 'token invalid' })

    const error = { error: '' }

    // Validate types
    if (!title || typeof title !== 'string')
      error.error = 'title must be string. '
    if (!author || typeof author !== 'string')
      error.error += 'author must be string. '
    if (!url || typeof url !== 'string')
      error.error += 'url must be string.'

    if (error.error !== '')
      return response.status(400).json(error)

    const user = await User.findById(tokenPayload.userId)

    if (!user)
      return response.status(400).json({ error: 'userId missing or invalid' })

    const blog = new Blog({
      title,
      author,
      url,
      likes: request.body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs.push(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  })

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const resultantBlog = await Blog.findOne({ _id: id })

  if (!resultantBlog) return response.status(404).json({
    error: 'No blog available'
  })

  response.json(resultantBlog)
})

blogRouter.delete(
  '/:id',
  extractTokenPayload,
  async (request, response) => {

    const id = request.params.id
    const { tokenPayload } = request

    if (!tokenPayload.userId)
      return response.status(401).json({ error: 'token invalid' })

    const blog = await Blog.findOne({ _id: id })

    if (!blog)
      return response.status(404).json({ error: 'No blog available' })

    if (blog.user.toString() !== tokenPayload.userId)
      return response.status(403).json({ error: `You're not authorized to delete this blog` })

    await blog.deleteOne()

    response.status(204).end()
  })

blogRouter.put(
  '/:id',
  verifyContentType,
  extractTokenPayload,
  async (request, response) => {

    const id = request.params.id
    const { tokenPayload } = request

    if (!tokenPayload.userId)
      return response.status(401).json({ error: 'token invalid' })

    const { title, author, url, likes } = request.body

    if (!title || !author || !url || !parseInt(likes)) {
      return response.status(400).json({ error: 'Atleast one valid value is required for blog' })
    }

    const blog = await Blog.findById(id)

    if (!blog)
      return response.status(404).json({ error: 'No blog available with given id' })

    if (blog.user.toString() !== tokenPayload.userId)
      return response.status(403).json({ error: `You're not authorized to delete this blog` })

    blog.title = title.trim() ?? blog.title
    blog.author = author.trim() ?? blog.author
    blog.url = url.trim() ?? blog.url
    blog.likes = parseInt(likes) ?? blog.likes

    await blog.save()

    response.json(blog)
  })

module.exports = blogRouter