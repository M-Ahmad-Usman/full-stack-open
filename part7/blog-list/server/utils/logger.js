const morgan = require('morgan')

// Custom body token to log body
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

const morganFormatFunction = (tokens, req, res) => {

  const tokensArray = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ]

  // Log body only if method is POST
  if (req.method === 'POST' || req.method === 'PUT') tokensArray.push(tokens.body(req, res))

  // Return formated string of predefined tokens
  return tokensArray.join(' ')
}

const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

const logger = { morganFormatFunction, info, error }

module.exports = logger