
const express = require('express')
const Blog = require('./models/blog')
const mongoose = require('mongoose')
const config = require('./utils/config')
const morgan = require('./utils/logger')
const logger = require('./utils/logger')

const app = express()

app.use(express.json())
app.use(morgan(logger.morganFormatFunction))

logger.info('Trying to connect to MongoDB...')

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then( () => logger.info('Connected to MongoDB') )
  .catch( e => logger.error(`Error Connecting to MongoDB: ${e}`) )

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
  logger.info(`Server running on port ${config.PORT}`)
})
