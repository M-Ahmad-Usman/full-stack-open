const User = require ('./models/user')
const Blog = require('./models/blog')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const config = require('./utils/config')

const users = [
  {
    name: 'alice johnson',
    username: 'alice_johnson',
    password: 'password123'
  },
  {
    name: 'bob smith',
    username: 'bob_smith',
    password: 'password123'
  },
]

async function main() {
  console.log(config)
  await mongoose.connect(config.MONGODB_URI, { family: 4 })
  console.log('Connected to MongoDB')

  await seedUsers()
  console.log('Two users seeded')

  await mongoose.disconnect()
  console.log('Disconnected from MongoDB')
}

async function seedUsers () {

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 1)
    await (new User({ name: user.name, username: user.username, passwordHash })).save()
  }
}

main()