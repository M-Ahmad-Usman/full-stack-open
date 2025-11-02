const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('Connecting to MongoDB')
mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB successfuly"))
    .catch(err => console.log("Error connecting to MongoDB ", err.message))


const personSchema = new mongoose.Schema({
    name: {
        type: String, 
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator : (number) => /^\d{2,3}-\d{5,}$/.test(number),
            message: () => `Valid number Format is: xx-xxxxxx... or xxx-xxxxx...`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)
module.exports = Person