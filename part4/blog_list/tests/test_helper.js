
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blogData = require('./blog_data')

const sampleBlogs = blogData.listWithMultipleBlogs

const removeProperty = (document, property) => {
  if (!property) return null

  delete document[property]
  return document
}

const nonExistingId = () => '6922f4397e0fe27d8c421713'

const getBlogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getUsersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createUser = async (user = {}) => {

  const password = user.password || 'Test password'
  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = new User({
    name: user.name || 'Test name',
    username: user.username || `testuser_${Date.now()}`,
    passwordHash
  })

  await newUser.save()
  return newUser
}

const createBlog = async (blog = {}, user = null) => {

  if (!user)
    user = await createUser()

  const newBlog = new Blog({
    title: blog.title || 'Test blog title',
    author: blog.author || 'Test blog author',
    url: blog.url || 'Test blog url',
    likes: blog.likes || 0,
    user: user._id
  })

  await newBlog.save()

  user.blogs.push(newBlog._id)
  await user.save()

  return newBlog
}

// Generates & return valid JWT token
// If no user is given generates token with empty payload
// expireTime is optional
const generateValidToken = (user, expireTime) => {

  let payload

  if (!user)
    payload = {}
  else
    // Same payload structure as in controllers/login.js
    payload = {
      username: user.username,
      userId: user._id
    }

  return jwt.sign(
    payload,
    process.env.SECRET,
    { expiresIn: expireTime ?? 60 * 60 }
  )
}

const generateInvalidToken = () => '123'

const clearDB = async () => {
  await Promise.allSettled([
    User.deleteMany(),
    Blog.deleteMany()
  ])
}

const getRandomBlog = () => {
  const randomIndex = Math.floor(Math.random() * sampleBlogs.length)
  return sampleBlogs[randomIndex]
}

const getSampleBlogs = () => sampleBlogs

const helper = {
  removeProperty,
  getBlogsInDB,
  getUsersInDB,
  nonExistingId,
  createUser,
  createBlog,
  getRandomBlog,
  getSampleBlogs,
  generateValidToken,
  generateInvalidToken,
  clearDB
}

module.exports = helper