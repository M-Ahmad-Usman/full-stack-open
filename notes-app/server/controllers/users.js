const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const middleware = require('../utils/middleware')

const verifyContentType = middleware.verifyContentType('application/json')

usersRouter.post('/', verifyContentType, async (request, response) => {
  const { username, name, password } = request.body

  if (!password) return response.status(400).json({ error: 'Password is required and must be atleast 5 characters' })
  if (password.length < 5) return response.status(400).json({ error: 'Password is shorter than the minimum allowed length (5)' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })

  response.json(users)
})

module.exports = usersRouter