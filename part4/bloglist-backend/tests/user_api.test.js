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

describe('User API', () => {

  beforeEach(async () => await helper.clearDB())

  const baseEndpoint = '/api/users'

  describe('GET /api/users', () => {

    test('all users are returned as JSON', async () => {
      const initialUsers = await Promise.all([
        helper.createUser(),
        helper.createUser()
      ])

      const { body: returnedUsers } = await api.get(baseEndpoint)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(returnedUsers.length, initialUsers.length)
    })

    test('users have id property instead of _id', async () => {
      await helper.createUser()

      const { body: users } = await api.get(baseEndpoint)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = users[0]

      assert(Object.hasOwn(user, 'id'))
      assert(!Object.hasOwn(user, '_id'))
    })

    test('users do not contain passwordHash', async () => {
      await helper.createUser()

      const { body: users } = await api.get(baseEndpoint)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = users[0]

      assert(!Object.hasOwn(user, 'passwordHash'))
    })

    test('users have populated blogs array', async () => {
      const user = await helper.createUser()
      await helper.createBlog({}, user)
      await helper.createBlog({}, user)

      const { body: users } = await api.get(baseEndpoint)
        .expect(200)

      assert.strictEqual(users[0].blogs.length, 2)
      assert(Object.hasOwn(users[0].blogs[0], 'title'))
      assert(Object.hasOwn(users[0].blogs[0], 'author'))
    })

  })

  describe('POST /api/users', () => {

    test('fails with status 415 if Content-Type is not application/json', async () => {
      const response = await api.post(baseEndpoint)
        .set('Content-Type', 'text/html')
        .send('<p>Hello</p>')
        .expect(415)

      const requiredKeywords = ['content-type', 'application/json']
      const error = response.body.error.toLowerCase()

      assert(requiredKeywords.every(k => error.includes(k)))
    })

    test('fails with status 400 if no body is sent', async () => {
      const response = await api.post(baseEndpoint)
        .set('Content-Type', 'application/json')
        .expect(400)

      const error = response.body.error.toLowerCase()
      assert(error.includes('username') || error.includes('password'))
    })

    test('fails with status 400 if username is missing', async () => {
      const response = await api.post(baseEndpoint)
        .send({ password: 'TestPassword123' })
        .expect(400)

      const error = response.body.error.toLowerCase()
      assert(error.includes('username'))
    })

    test('fails with status 400 if password is missing', async () => {
      const response = await api.post(baseEndpoint)
        .send({ username: 'testuser' })
        .expect(400)

      const error = response.body.error.toLowerCase()
      assert(error.includes('password'))
    })

    test('fails with status 400 if password is not a string', async () => {
      const response = await api.post(baseEndpoint)
        .send({
          username: 'testuser',
          password: 12345
        })
        .expect(400)

      const error = response.body.error.toLowerCase()
      assert(error.includes('password') && error.includes('string'))
    })

    test('fails with status 400 if password is shorter than 3 characters', async () => {
      const response = await api.post(baseEndpoint)
        .send({
          username: 'testuser',
          password: 'ab'
        })
        .expect(400)

      const error = response.body.error.toLowerCase()
      assert(error.includes('password') && error.includes('3'))
    })

    test('fails with status 400 if username is shorter than 3 characters', async () => {
      const response = await api.post(baseEndpoint)
        .send({
          username: 'ab',
          password: 'ValidPassword123'
        })
        .expect(400)

      const error = response.body.error.toLowerCase()
      assert(error.includes('username') && error.includes('3'))
    })

    test('fails with status 400 if username already exists', async () => {
      const username = 'uniqueuser'
      const password = 'TestPassword'

      // First user creation
      await api.post(baseEndpoint)
        .send({
          username,
          password
        })
        .expect(201)

      // Try to create second user with same username
      const response = await api.post(baseEndpoint)
        .send({
          username,
          password: 'ValidPassword123'
        })
        .expect(400)

      const error = response.body.error

      // MongoDB unique index violation error
      assert(error.includes('username') || error.includes('duplicate'))
    })

    test('succeeds with status 201 on valid data', async () => {
      const userData = {
        name: 'Test User',
        username: 'newtestuser',
        password: 'ValidPassword123'
      }

      const { body: savedUser } = await api.post(baseEndpoint)
        .send(userData)
        .expect(201)

      assert.strictEqual(savedUser.username, userData.username)
      assert.strictEqual(savedUser.name, userData.name)
      assert(!Object.hasOwn(savedUser, 'passwordHash'))
      assert(Object.hasOwn(savedUser, 'id'))
    })

    test('user is added to database on successful creation', async () => {
      const userData = {
        name: 'Another Test User',
        username: 'anothertestuser',
        password: 'ValidPassword456'
      }

      await api.post(baseEndpoint)
        .send(userData)
        .expect(201)

      const usersInDB = await helper.getUsersInDB()

      assert.strictEqual(usersInDB.length, 1)
      assert.strictEqual(usersInDB[0].username, userData.username)
    })

    test('succeeds with status 201 when name is not provided', async () => {
      const userData = {
        username: 'testuser_noname',
        password: 'ValidPassword123'
      }

      const { body: savedUser } = await api.post(baseEndpoint)
        .send(userData)
        .expect(201)

      assert.strictEqual(savedUser.username, userData.username)
    })

  })

  describe('DELETE /api/users/:id', () => {

    test('fails with status 400 if user does not exist', async () => {
      const response = await api.delete(baseEndpoint + '/' + helper.nonExistingId())
        .expect(400)

      const error = response.body.error.toLowerCase()
      assert(error.includes('user') || error.includes('does not exist'))
    })

    test('fails with status 400 if id is invalid', async () => {
      const response = await api.delete(baseEndpoint + '/' + '123')
        .expect(400)

      const error = response.body.error
      assert(error === 'malformatted id')
    })

    test('succeeds with status 200 on valid id', async () => {
      const user = await helper.createUser()

      const { body: deletedUser } = await api.delete(baseEndpoint + '/' + user._id.toString())
        .expect(200)

      assert.strictEqual(deletedUser.id, user._id.toString())
      assert.strictEqual(deletedUser.username, user.username)
    })

    test('user is removed from database on successful deletion', async () => {
      await helper.createUser()

      const usersInDB = await helper.getUsersInDB()
      assert.strictEqual(usersInDB.length, 1)

      await api.delete(baseEndpoint + '/' + usersInDB[0].id)
        .expect(200)

      const usersAfterDelete = await helper.getUsersInDB()
      assert.strictEqual(usersAfterDelete.length, 0)
    })

  })

})

// After everything is done we have to close the mongoDB collection
// otherwise the program will not terminate
after(() => {
  mongoose.connection.close()
})
