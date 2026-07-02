const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    // This index willn't be applied if there are already duplicated usernames
    // Mongoose validations do not detect the index violation,
    // and instead of ValidationError they return an error of type MongoServerError.
    // This error is handled by the the error handling middleware.
    unique: true, // this ensures the uniquness of username
    minLength: 3
  },
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

// Remove __v and convert _id to id when toJSON method is called
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User