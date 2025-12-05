
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Attach token payload to request
const extractTokenPayload = (request, response, next) => {
  const authorizationHeader = request.get('authorization')

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'JWT access token with Bearer scheme is required to access this route.' })
  }

  // The header is "Bearer token...."
  // Remove "Bearer " to extract token
  const token = authorizationHeader.replace('Bearer ', '')
  // If the token is missing or invalid
  // then JsonWebTokenError exception will be thrown on jwt.verify
  // This exception will be handled by the error handling middleware
  const payload = jwt.verify(token, process.env.SECRET)

  // Attach payload to request
  request.tokenPayload = payload
  next()
}

const verifyContentType = (contentType) => {

  return (request, response, next) => {
    const contentTypeHeader = request.get('Content-Type')

    if (!contentTypeHeader || !contentTypeHeader.includes(contentType))
      return response.status(415).json({ error: `Content-Type must be ${contentType}` })

    next()
  }
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })

  else if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message })

  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error'))
    return response.status(400).json({ error: error.message })

  else if (error.name === 'JsonWebTokenError')
    return response.status(401).json({ error: 'The attached JWT token is invalid or missing' })

  else if (error.name === 'TokenExpiredError')
    return response.status(401).json({ error: 'token expired' })

  next(error)
}

const middlewares = {
  unknownEndpoint,
  errorHandler,
  extractTokenPayload,
  verifyContentType
}

module.exports = middlewares