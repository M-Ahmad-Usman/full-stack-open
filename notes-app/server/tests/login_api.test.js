const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const baseEndpoint = '/api/login'

describe('Login API', () => {

  describe(`POST ${baseEndpoint}`, () => {

    beforeEach(async () => {
      await helper.clearDatabase()
    })

    test('succeds with status 200 on valid credentials', async () => {

      const newUser = {
        username: 'Ahmad',
        password: 'Ahmad123'
      }

      await helper.createUser(newUser)

      const res = await api.post(baseEndpoint)
        .send(newUser)
        .expect(200)

      assert(res.body.token)
      assert.strictEqual(res.body.username, newUser.username)

    })

    test('fails with status 401 on invalid user credentials',async () => {

      const nonExistingUser = {
        username: 'non-existing name',
        password: 'non-existing password'
      }

      await api.post(baseEndpoint)
        .send(nonExistingUser)
        .expect(401)

    })

    test('fails with status 400 if no credentials are provided', async () => {
      await api.post(baseEndpoint).send({}).expect(400)
    })

    test('fails with status 400 if Content-Type is invalid or not application/json', async () => {
      await api.post(baseEndpoint).expect(400)
    })

  })

})

after(async () => {
  await helper.clearDatabase()
  await mongoose.connection.close()
})