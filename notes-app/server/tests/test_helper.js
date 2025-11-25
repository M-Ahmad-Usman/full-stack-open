const bcrypt = require('bcrypt')
const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

// Factory function to create a test user
const createUser = async (userData = {}) => {
  const defaultPassword = userData.password || 'testpassword123'
  const passwordHash = await bcrypt.hash(defaultPassword, 10)

  const user = new User({
    username: userData.username || 'testuser',
    name: userData.name || 'Test User',
    passwordHash,
    notes: userData.notes || []
  })

  return await user.save()
}

// Factory function to create a test note
const createNote = async (noteData = {}, user = null) => {
  if (!user) {
    user = await createUser()
  }

  const note = new Note({
    content: noteData.content || 'Test note content',
    important: noteData.important !== undefined ? noteData.important : false,
    user: user._id
  })

  const savedNote = await note.save()

  // Update user's notes array
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  return savedNote
}

// Clear all test data from database
const clearDatabase = async () => {
  await Note.deleteMany({})
  await User.deleteMany({})
}

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialNotes,
  createUser,
  createNote,
  clearDatabase,
  nonExistingId,
  notesInDb,
  usersInDb
}