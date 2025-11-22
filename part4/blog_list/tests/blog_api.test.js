const { test, after, beforeEach } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')

const mongoose = require('mongoose')
const Blog = require('../models/blog')

const app = require('../app')

const blogData = require('./blog_data')

const api = supertest(app)

const formatDocument = document => {
  delete document.__v
  delete document._id
  return document
}

// Remove _id and __v properties
const blogList = blogData.listWithMultipleBlogs
  .map(formatDocument)

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

  const notes = res.body.map(formatDocument)

  assert.deepStrictEqual(notes, blogList)
})

// After everything is done we have to close the mongoDB collection
// otherwise the program will not terminte
after(() => {
  mongoose.connection.close()
})