const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const middleware = require('../utils/middleware')

const CONTENT_TYPE = 'application/json'

const verifyContentType = middleware.verifyContentType(CONTENT_TYPE)

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  response.json(users)
})

userRouter.post('/', verifyContentType, async (request, response) => {

  const { name, username, password } = request.body

  if (!username || !password)
    return response.status(400).json({ error: 'Username and password are required.' })

  const PASSWORD_MIN_LENGTH = 3
  const USERNAME_MIN_LENGTH = 3

  // The type of password must be string as bcrypt expects string
  if (typeof password !== 'string')
    return response.status(400).json({ error: `password must be string atleast ${PASSWORD_MIN_LENGTH} characters long` })

  if (password.length < PASSWORD_MIN_LENGTH)
    return response.status(400).json({ error: `Password must be atleast ${PASSWORD_MIN_LENGTH} characters long` })

  if (username.length < USERNAME_MIN_LENGTH)
    return response.status(400).json({ error: `Username must be atleast ${USERNAME_MIN_LENGTH} characters long` })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name,
    username,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)

})

userRouter.delete('/:id', async (request, response) => {
  const userId = request.params.id
  const deletedUser = await User.findByIdAndDelete(userId)

  if (!deletedUser)
    return response.status(400).json({ error: 'User does not exist' })

  response.json(deletedUser)

})

module.exports = userRouter