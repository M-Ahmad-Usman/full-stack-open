const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('Note API', () => {

  beforeEach(async () => {
    await helper.clearDatabase()
  })

  describe('GET /api/notes', () => {

    test('returns notes as json', async () => {
      await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns all notes', async () => {
      const user = await helper.createUser({ username: 'testuser1' })

      await helper.createNote({ content: 'First note' }, user)
      await helper.createNote({ content: 'Second note' }, user)

      const response = await api.get('/api/notes')
      assert.strictEqual(response.body.length, 2)
    })

    test('returns empty array when no notes exist', async () => {
      const response = await api.get('/api/notes')
      assert.strictEqual(response.body.length, 0)
    })
  })

  describe('GET /api/notes/:id', () => {

    test('succeeds with valid id', async () => {
      const user = await helper.createUser({ username: 'testuser2' })
      const note = await helper.createNote({ content: 'Test note' }, user)

      const response = await api
        .get(`/api/notes/${note.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.content, 'Test note')
      assert.strictEqual(response.body.id, note.id)
    })

    test('fails with 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api.get(`/api/notes/${validNonexistingId}`).expect(404)
    })

    test('fails with 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api.get(`/api/notes/${invalidId}`).expect(400)
    })
  })

  describe('POST /api/notes', () => {

    test('succeeds with valid data', async () => {
      const user = await helper.createUser({ username: 'noteCreator' })

      const token = helper.generateToken(user)

      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }

      const response = await api
        .post('/api/notes')
        .send(newNote)
        .auth(token, { type: 'bearer' })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.content, newNote.content)
      assert.strictEqual(response.body.important, true)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, 1)

      const contents = notesAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('sets important to false by default', async () => {
      const user = await helper.createUser({ username: 'defaultUser' })

      const token = helper.generateToken(user)

      const newNote = {
        content: 'Note without importance flag',
      }

      const response = await api
        .post('/api/notes')
        .auth(token, { type: 'bearer' })
        .send(newNote)
        .expect(201)

      assert.strictEqual(response.body.important, false)
    })

    test('fails with 400 if content is missing', async () => {
      const user = await helper.createUser({ username: 'badUser' })

      const token = helper.generateToken(user)

      const newNote = {
        important: true,
      }

      await api.post('/api/notes')
        .send(newNote)
        .auth(token, { type: 'bearer' })
        .expect(400)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, 0)
    })

    test('fails with 401 if token is missing', async () => {

      const newNote = {
        content: 'Note without token',
        important: true
      }

      await api.post('/api/notes').send(newNote).expect(401)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, 0)
    })

    test('fails with 401 if token is invalid', async () => {
      const newNote = {
        content: 'Note with invalid user',
      }

      const INVALID_TOKEN = 'random'

      await api.post('/api/notes')
        .send(newNote)
        .auth(INVALID_TOKEN, { type: 'bearer' })
        .expect(401)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, 0)
    })
  })

  describe('DELETE /api/notes/:id', () => {

    test('succeeds with 204 if id is valid', async () => {
      const user = await helper.createUser({ username: 'deletor' })
      const note = await helper.createNote({ content: 'To be deleted' }, user)

      const notesAtStart = await helper.notesInDb()
      assert.strictEqual(notesAtStart.length, 1)

      await api.delete(`/api/notes/${note.id}`).expect(204)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, 0)

      const contents = notesAtEnd.map(n => n.content)
      assert(!contents.includes('To be deleted'))
    })

    test('succeeds with 204 even if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api.delete(`/api/notes/${validNonexistingId}`).expect(204)
    })
  })

  describe('PUT /api/notes/:id', () => {

    test('succeeds with valid data', async () => {
      const user = await helper.createUser({ username: 'updater' })
      const note = await helper.createNote({
        content: 'Original content',
        important: false
      }, user)

      const updatedData = {
        content: 'Updated content',
        important: true
      }

      const response = await api
        .put(`/api/notes/${note.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.content, 'Updated content')
      assert.strictEqual(response.body.important, true)
    })

    test('fails with 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      const updatedData = {
        content: 'Updated content',
        important: true
      }

      await api
        .put(`/api/notes/${validNonexistingId}`)
        .send(updatedData)
        .expect(404)
    })
  })
})

after(async () => {
  await helper.clearDatabase()
  await mongoose.connection.close()
})