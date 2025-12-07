// IMPORTANT: This script will clear the database.
const mongoose = require('mongoose')
const config = require('./utils/config')
const { createUser, createNote, clearDatabase } = require('./tests/test_helper')

const noteContents = [
  'HTML is the structure of web pages',
  'CSS makes websites beautiful',
  'JavaScript adds interactivity to web pages',
  'Node.js allows JavaScript to run on the server',
  'Express is a minimal web framework for Node.js',
  'MongoDB is a NoSQL database',
  'React is a library for building user interfaces',
  'REST APIs are a common way to structure web services',
  'Authentication is crucial for secure applications',
  'Testing ensures code quality and reliability',
  'Git is essential for version control',
  'Async/await makes asynchronous code easier to read',
  'Middleware functions have access to request and response objects',
  'Mongoose provides schema-based modeling for MongoDB',
  'Environment variables keep sensitive data secure',
]

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')

    console.log('Clearing the Database')
    await clearDatabase()
    console.log('Database cleared successfully')

    // Create first user
    console.log('Creating first user...')
    const user1 = await createUser({
      username: 'alice_johnson',
      name: 'Alice Johnson',
      password: 'password123'
    })
    console.log(`Created user: ${user1.username}`)

    // Create second user
    console.log('Creating second user...')
    const user2 = await createUser({
      username: 'bob_smith',
      name: 'Bob Smith',
      password: 'password456'
    })
    console.log(`Created user: ${user2.username}`)

    // Create random notes for user1
    const user1NotesCount = Math.floor(Math.random() * 5) + 3 // 3-7 notes
    console.log(`Creating ${user1NotesCount} notes for ${user1.username}...`)

    for (let i = 0; i < user1NotesCount; i++) {
      const randomContent = noteContents[Math.floor(Math.random() * noteContents.length)]
      const randomImportant = Math.random() > 0.5

      await createNote({
        content: randomContent,
        important: randomImportant
      }, user1)
    }

    // Create random notes for user2
    const user2NotesCount = Math.floor(Math.random() * 5) + 3 // 3-7 notes
    console.log(`Creating ${user2NotesCount} notes for ${user2.username}...`)

    for (let i = 0; i < user2NotesCount; i++) {
      const randomContent = noteContents[Math.floor(Math.random() * noteContents.length)]
      const randomImportant = Math.random() > 0.5

      await createNote({
        content: randomContent,
        important: randomImportant
      }, user2)
    }

    console.log('Database seeding completed successfully!')

    // Display summary
    const User = require('./models/user')
    const Note = require('./models/note')

    const users = await User.find({})
    const notes = await Note.find({})

    console.log('\n=== Seeding Summary ===')
    console.log(`Total users: ${users.length}`)
    console.log(`Total notes: ${notes.length}`)

    for (const user of users) {
      const userNotes = await Note.find({ user: user._id })
      console.log(`  - ${user.username} (${user.name}): ${userNotes.length} notes`)
    }
    console.log('=======================\n')

  } catch (error) {
    console.error('Error seeding database:', error.message)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('Database connection closed')
  }
}

seedDatabase()
