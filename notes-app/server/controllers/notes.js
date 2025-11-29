
const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')
const middleware = require('../utils/middleware')

const verifyContentType = middleware.verifyContentType('application/json')

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', verifyContentType, async (request, response) => {

  // If the value of token in authorization header is missing or invalid,
  // the exception JSONWEBTOKENERROR is raised.
  // Which will be handled by the error handling middleware in utils/middleware.js
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) return response.status(400).json({ error: 'userId missing or not valid' })

  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)

})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', verifyContentType, async (request, response) => {
  const { content, important } = request.body

  const note = await Note.findById(request.params.id)

  if (!note) return response.status(404).end()

  note.content = content
  note.important = important

  await note.save()
  response.json(note)
})

module.exports = notesRouter