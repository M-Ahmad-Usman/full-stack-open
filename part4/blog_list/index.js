
const express = require('express')
const Blog = require('./models/blog')
const mongoose = require('mongoose')
const config = require('./utils/config')

const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 }).then(() => console.log('MongoDB connected'), (e) => console.log('Error: ', e))

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {

  const { title, author, url } = request.body

  if (!title) return response.status(400).json({ error: `Blog's title is required` })
  if (!author) return response.status(400).json({ error: 'Author is required' })
  if (!url) return response.status(400).json({ error: `Blog's url is required` })

  const blog = new Blog({ title, author, url, likes: 0 })

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
