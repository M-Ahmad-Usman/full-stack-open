// Testing
const { test, beforeEach, describe, after } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')

// DB
const mongoose = require('mongoose')
const User = require('../models/user')

// Hashing
const bcrypt = require('bcrypt')

// Local modules
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  describe('creation of new user', async () => {

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  test('creation fails with 400 if length of username is less than 4', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '123',
      name: 'Something',
      password: '1234567'
    }

    const res = await api.post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert(res.body.error.includes('shorter than the minimum allowed length (4)'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

  })

  test.only('creation fails with 400 if length of password is less than 5', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '12d3',
      name: 'Something',
      password: '1234'
    }

    const res = await api.post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert(res.body.error.includes('shorter than the minimum allowed length (5)'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})