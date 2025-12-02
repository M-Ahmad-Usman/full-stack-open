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

  describe('GET /api/blogs/:id', () => {

    test('succeeds with status 200 on valid id', async () => {
      const initialBlog = (await helper.createBlog()).toJSON()
      initialBlog.user = initialBlog.user.toString()

      const { body: returnedBlog } = await api
        .get(baseEndpoint + '/' + initialBlog.id)
        .expect(200)

      assert.deepStrictEqual(returnedBlog, initialBlog)
    })

    test('fails with status 404 on non-existing id', async () => {
      await api
        .get(baseEndpoint + '/' + helper.nonExistingId())
        .expect(404)
    })

    test('fails with with status 400 on invalid id', async () => {
      const response = await api
        .get(baseEndpoint + '/' + '123')
        .expect(400)

      const error = response.body.error
      assert(error === 'malformatted id')
    })

  })

  describe('POST /api/blogs', () => {

    test('fails with 401 if no authentication header', async () => {

      const blog = helper.getRandomBlog()

      const response = await api.post(baseEndpoint)
        .send(blog)
        .expect(401)

      const requiredKeywords = ['jwt', 'token', 'access token', 'required', 'bearer scheme']

      const error = response.body.error.toLowerCase()

      assert(requiredKeywords.every(k => error.includes(k)))
    })

    test(`fails with status 401 if token doesn't has expected data`, async () => {
      const blog = helper.getRandomBlog()
      const tokenWithInvalidPayload = helper.generateValidToken()

      const response = await api.post(baseEndpoint)
        .send(blog)
        .auth(tokenWithInvalidPayload, { type: 'bearer' })
        .expect(401)

      const error = response.body.error.toLowerCase()
      const requiredKeywords = ['token', 'invalid']

      assert(requiredKeywords.every(k => error.includes(k)))
    })

    test('fails with status 401 if jwt token itself is invalid', async () => {
      const blog = helper.getRandomBlog()
      const invalidToken = helper.generateInvalidToken()

      const response = await api.post(baseEndpoint)
        .send(blog)
        .auth(invalidToken, { type: 'bearer' })
        .expect(401)

      const error = response.body.error.toLowerCase()
      const requiredKeywords = ['token', 'missing', 'invalid']

      assert(requiredKeywords.every(k => error.includes(k)))
    })

    test('fails with 401 if token is expired', async () => {
      const blog = helper.getRandomBlog()
      const user = await helper.createUser()

      // Expires in 1ms second
      // Use very small time. 1 second doesn't works
      const expiredToken = helper.generateValidToken(user, '1ms')

      const response = await api.post(baseEndpoint)
        .send(blog)
        .auth(expiredToken, { type: 'bearer' })
        .expect(401)

      const error = response.body.error.toLowerCase()
      assert(error.includes('expired'))
    })

    test('succeeds with status 201 on valid data and token', async () => {
      const blog = helper.getRandomBlog()
      const user = await helper.createUser()

      const token = helper.generateValidToken(user)

      await api.post(baseEndpoint)
        .send(blog)
        .auth(token, { type: 'bearer' })
        .expect(201)

      const blogsInDB = await helper.getBlogsInDB()

      // DB is cleared before every test so there will be only 1 blog
      assert.strictEqual(blogsInDB.length, 1)
    })

  })

})

// After everything is done we have to close the mongoDB collection
// otherwise the program will not terminte
after(() => {
  mongoose.connection.close()
})