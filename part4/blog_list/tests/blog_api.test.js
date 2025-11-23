const { test, after, beforeEach } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')

const mongoose = require('mongoose')
const Blog = require('../models/blog')

const blogData = require('./blog_data')
const helper = require('./test_helper')

const app = require('../app')

const api = supertest(app)

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

  const blogs = res.body.map(blog => helper.removeProperty(blog, 'id'))

  assert.deepStrictEqual(blogs, blogList)
})

test('blogs have id property instead of _id', async () => {
  const { body: blogs } = await api.get('/api/blogs')

  // Check existence of id property
  assert(Object.hasOwn(blogs[0], 'id'))
  // Check absence of _id property
  assert(!Object.hasOwn(blogs[0], '_id'))
})

test('a valid blog can be added', async () => {
  const newBlog = blogData.listWithOneBlog[0]

  const { body: savedBlog } = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { body: blogs } = await api.get('/api/blogs')

  // Check if blog has been added or not
  assert.deepEqual(blogs.length, blogList.length + 1)
  // Verify the contents of blogs
  assert.deepStrictEqual(helper.removeProperty(savedBlog, 'id'), newBlog)
})

test('an invalid blog cannot be added', async () => {
  const blog = blogData.listWithOneBlog[0]

  const postOperationsWithInvalidData = [

    // save blog without title
    api.post('/api/blogs')
      .send(helper.removeProperty(blog, 'title'))
      .expect(400),

    // save blog without author
    api.post('/api/blogs')
      .send(helper.removeProperty(blog, 'author'))
      .expect(400),

    // save blog without url
    api.post('/api/blogs')
      .send(helper.removeProperty(blog, 'url'))
      .expect(400)
  ]

  await Promise.all(postOperationsWithInvalidData)

  const { body: blogs } = await api.get('/api/blogs')

  assert.deepEqual(blogs.length, blogList.length)

})

// After everything is done we have to close the mongoDB collection
// otherwise the program will not terminte
after(() => {
  mongoose.connection.close()
})