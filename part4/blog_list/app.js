
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const morgan = require('morgan')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())
app.use(morgan(logger.morganFormatFunction))

logger.info('Trying to connect to MongoDB...')

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => logger.info('Connected to MongoDB'))
  .catch(e => logger.error(`Error Connecting to MongoDB: ${e}`))

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app