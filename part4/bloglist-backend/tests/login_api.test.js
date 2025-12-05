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

describe('Login API', () => {

  beforeEach(async () => await helper.clearDB())

  const baseEndpoint = '/api/login'

  describe('POST /api/login', () => {

    test('fails with status 400 if no body is sent', async () => {
      const response = await api.post(baseEndpoint)
        .set('Content-Type', 'application/json')
        .expect(400)

      const error = response.body.error.toLowerCase()
      const expectedKeywords = ['username', 'password', 'required', 'missing']
      assert(expectedKeywords.some(k => error.includes(k)))
    })

    test('fails with status 400 if username is missing', async () => {
      const response = await api.post(baseEndpoint)
        .send({ password: 'SomePassword' })
        .expect(400)

      const error = response.body.error.toLowerCase()
      const expectedKeywords = ['username', 'required', 'missing']
      assert(expectedKeywords.some(k => error.includes(k)))
    })

    test('fails with status 400 if password is missing', async () => {
      const response = await api.post(baseEndpoint)
        .send({ username: 'testuser' })
        .expect(400)

      const error = response.body.error.toLowerCase()
      const expectedKeywords = ['password', 'required', 'missing']
      assert(expectedKeywords.some(k => error.includes(k)))
    })

    test('fails with status 400 if password is not a string', async () => {
      const response = await api.post(baseEndpoint)
        .send({
          username: 'testuser',
          password: 12345
        })
        .expect(400)

      const error = response.body.error.toLowerCase()
      const expectedKeywords = ['password', 'string']
      assert(expectedKeywords.some(k => error.includes(k)))
    })

    test('fails with status 401 if username does not exist', async () => {
      const response = await api.post(baseEndpoint)
        .send({
          username: 'nonexistentuser',
          password: 'SomePassword123'
        })
        .expect(401)

      const error = response.body.error.toLowerCase()
      const expectedKeywords = ['invalid', 'username']
      assert(expectedKeywords.some(k => error.includes(k)))
    })

    test('fails with status 401 if password is incorrect', async () => {
      const user = await helper.createUser({ password: 'CorrectPassword' })

      const response = await api.post(baseEndpoint)
        .send({
          username: user.username,
          password: 'WrongPassword'
        })
        .expect(401)

      const error = response.body.error.toLowerCase()
      const expectedKeywords = ['invalid', 'password']
      assert(expectedKeywords.some(k => error.includes(k)))
    })

    test('succeeds with status 201 on valid credentials', async () => {
      const password = 'CorrectPassword123'
      const user = await helper.createUser({ password })

      const { body: response } = await api.post(baseEndpoint)
        .send({
          username: user.username,
          password
        })
        .expect(201)

      assert(Object.hasOwn(response, 'accessToken'))
      assert.strictEqual(response.username, user.username)
      assert.strictEqual(response.name, user.name)
    })

    test('returns a valid JWT token on successful login', async () => {
      const password = 'TestPassword123'
      const user = await helper.createUser({ password })

      const { body: loginResponse } = await api.post(baseEndpoint)
        .send({
          username: user.username,
          password
        })
        .expect(201)

      const token = loginResponse.accessToken

      // Verify token is not empty and has JWT structure (3 parts separated by dots)
      assert(token)
      const tokenParts = token.split('.')
      assert.strictEqual(tokenParts.length, 3)
    })

    test('token can be used to access protected routes', async () => {
      const password = 'TestPassword456'
      const user = await helper.createUser({ password })

      const { body: loginResponse } = await api.post(baseEndpoint)
        .send({
          username: user.username,
          password
        })
        .expect(201)

      const token = loginResponse.accessToken

      // Try to create a blog with the token
      const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://example.com'
      }

      await api.post('/api/blogs')
        .send(blog)
        .auth(token, { type: 'bearer' })
        .expect(201)
    })

    test('token contains correct user information', async () => {
      const password = 'TestPassword789'
      const userData = { username: 'uniqueuser123', password }
      const user = await helper.createUser(userData)

      const { body: loginResponse } = await api.post(baseEndpoint)
        .send({
          username: user.username,
          password
        })
        .expect(201)

      const token = loginResponse.accessToken
      const decodedToken = helper.decodeToken(token)

      assert.strictEqual(decodedToken.username, user.username)
      assert.strictEqual(decodedToken.userId, user._id.toString())
    })

    test('returns valid tokens on consecutive logins', async () => {
      const password = 'ConsecutiveLoginTest'
      const user = await helper.createUser({ password })

      const { body: response1 } = await api.post(baseEndpoint)
        .send({
          username: user.username,
          password
        })
        .expect(201)

      // Small delay to ensure different iat claim
      await new Promise(resolve => setTimeout(resolve, 1100))

      const { body: response2 } = await api.post(baseEndpoint)
        .send({
          username: user.username,
          password
        })
        .expect(201)

      // Both tokens should be valid and contain correct user data
      const token1Payload = helper.decodeToken(response1.accessToken)
      const token2Payload = helper.decodeToken(response2.accessToken)

      assert.strictEqual(token1Payload.username, user.username)
      assert.strictEqual(token2Payload.username, user.username)

      // The iat (issued at) should be different if 1+ seconds passed
      assert.notStrictEqual(token1Payload.iat, token2Payload.iat)
    })

    test('returns correct user data in response', async () => {
      const userData = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'Password123'
      }
      const user = await helper.createUser(userData)

      const { body: response } = await api.post(baseEndpoint)
        .send({
          username: user.username,
          password: userData.password
        })
        .expect(201)

      assert.strictEqual(response.name, userData.name)
      assert.strictEqual(response.username, userData.username)
      assert(!Object.hasOwn(response, 'passwordHash'))
      assert(!Object.hasOwn(response, '_id'))
    })

    test('fails with status 400 when password is empty string', async () => {
      const user = await helper.createUser({ password: 'ValidPassword' })

      const response = await api.post(baseEndpoint)
        .send({
          username: user.username,
          password: ''
        })
        .expect(400)

      const error = response.body.error.toLowerCase()
      const expectedKeywords = ['invalid', 'password']
      assert(expectedKeywords.some(k => error.includes(k)))
    })

  })

})

// After everything is done we have to close the mongoDB collection
// otherwise the program will not terminate
after(() => {
  mongoose.connection.close()
})
