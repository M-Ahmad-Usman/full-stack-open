const { test, beforeEach, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('User API', () => {

  beforeEach(async () => {
    await helper.clearDatabase()
  })

  describe('GET /api/users', () => {

    test('returns empty array when no users exist', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, 0)
    })

    test('returns all users as json', async () => {
      await helper.createUser({ username: 'user1', password: 'pass123' })
      await helper.createUser({ username: 'user2', password: 'pass456' })

      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, 2)
    })

    test('does not return passwordHash field', async () => {
      await helper.createUser({ username: 'testuser', password: 'secret123' })

      const response = await api.get('/api/users')

      assert(!Object.hasOwn(response.body[0], 'passwordHash'))
    })
  })

  describe('POST /api/users', () => {

    test('succeeds with valid data', async () => {
      const newUser = {
        username: 'newuser',
        name: 'New User',
        password: 'validpass123',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.username, 'newuser')
      assert.strictEqual(response.body.name, 'New User')
      assert(!Object.hasOwn(response.body, 'passwordHash'))

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes('newuser'))
    })

    test('creates user with hashed password', async () => {
      const newUser = {
        username: 'secureuser',
        password: 'mypassword123',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)

      const user = await User.findOne({ username: 'secureuser' })

      assert.notStrictEqual(user.passwordHash, 'mypassword123')
    })

    test('fails with 400 if username is missing', async () => {
      const newUser = {
        name: 'Test User',
        password: 'validpass123'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('required'))

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, 0)
    })

    test('fails with 400 if username is too short', async () => {
      const newUser = {
        username: 'abc',
        name: 'Test User',
        password: 'validpass123'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('shorter than the minimum allowed length (4)'))

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, 0)
    })

    test('fails with 400 if username already exists', async () => {
      await helper.createUser({ username: 'existinguser', password: 'pass123' })

      const newUser = {
        username: 'existinguser',
        name: 'Another User',
        password: 'anotherpass123',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('expected `username` to be unique'))

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, 1)
    })

    test('fails with 400 if password is missing', async () => {
      const newUser = {
        username: 'testuser',
        name: 'Test User'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('Password is required'))

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, 0)
    })

    test('fails with 400 if password is too short', async () => {
      const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'abc'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('shorter than the minimum allowed length (5)'))

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, 0)
    })
  })

  test('fails with 400 if no content is send or Content-Type isn not application/json', async () => {
    await api.post('/api/users').expect(400)
  })

})

after(async () => {
  await helper.clearDatabase()
  await mongoose.connection.close()
})