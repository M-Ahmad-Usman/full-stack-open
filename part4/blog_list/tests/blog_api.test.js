const { test, after, beforeEach } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')

const mongoose = require('mongoose')
const Blog = require('../models/blog')

const app = require('../app')

const blogData = require('./blog_data')

const api = supertest(app)

const removeId = document => {
  delete document.id
  return document
}

const blogList = blogData.listWithMultipleBlogs

// Persist DB state.
// Every test will get the same state of DB
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogList)
})

test('blogs are returned as json', async () => {
  const res = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = res.body.map(removeId)

  assert.deepStrictEqual(blogs, blogList)
})

test('blogs have id property instead of _id', async () => {
  const { body: blogs } = await api.get('/api/blogs')

  // Check existence of id property
  assert(Object.hasOwn(blogs[0], 'id'))
  // Check absence of _id property
  assert(!Object.hasOwn(blogs[0], '_id'))
})

// After everything is done we have to close the mongoDB collection
// otherwise the program will not terminte
after(() => {
  mongoose.connection.close()
})