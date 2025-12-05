const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {

  const { username, password } = request.body

  if (!username || !password)
    return response.status(400).json({ error: 'username and password are required' })

  // The type of password must be string as bcrypt expects string
  if (typeof password !== 'string')
    return response.status(400).json({ error: 'password must be of type string' })

  const user = await User.findOne({ username })

  if (!user)
    return response.status(401).json({ error: 'Invalid username or password' })

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordCorrect)
    return response.status(401).json({ error: 'invalid username or password' })

  const userForToken = {
    username,
    userId: user._id
  }

  // Token will expire in 1 hour
  const accessToken = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )

  response.status(201)
    .json({ accessToken, username: username, name: user?.name })

})

module.exports = loginRouter