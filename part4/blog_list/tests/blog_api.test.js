// Testing related modules
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')

// DB related module
const mongoose = require('mongoose')

// Local helping module
const helper = require('./test_helper')

// Main app module
const app = require('../app')

const api = supertest(app)

describe('Blog API', () => {

  beforeEach(async () => await helper.clearDB())

  const baseEndpoint = '/api/blogs'

  describe('GET /api/blogs', () => {


    test('all blogs are returned as JSON', async () => {
      const initialBlogs = await Promise.all([
        helper.createBlog(),
        helper.createBlog()
      ])

      const { body: returnedBlogs } = await api.get(baseEndpoint)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(returnedBlogs.length, initialBlogs.length)
    })

    test('blogs have id property instead of _id', async () => {
      await helper.createBlog()

      const { body: blogs } = await api.get(baseEndpoint)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blog = blogs[0]

      assert(Object.hasOwn(blog, 'id'))
      assert(!Object.hasOwn(blog, '_id'))
    })

  })

})

// After everything is done we have to close the mongoDB collection
// otherwise the program will not terminte
after(() => {
  mongoose.connection.close()
})