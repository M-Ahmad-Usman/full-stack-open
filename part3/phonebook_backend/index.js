
const morgan = require('morgan')
require('dotenv').config()
const express = require('express')
const app = express()

const Person = require('./models/person')

app.use(express.json())

// Custom body token to log body
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(
    morgan(function (tokens, req, res) {

        const tokensArray = [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
        ]

        // Log body only if method is POST
        if (req.method === "POST") tokensArray.push(tokens.body(req, res))

        // Return formated string of predefined tokens
        return tokensArray.join(' ')
    })
)
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {

    Person
        .find({})
        .then(people => response.json(people))
        .catch(err => response.status(401).json({
            error: err.message,
            message: 'Something went wrong'
        }))
})

app.get('/info', (request, response) => {

    Person.countDocuments({})
        .then(length => {
            const markup =
                `<p>Phonebook has info of ${length} people</p>
            <p>${new Date().toString()}</p>`

            response.send(markup)
        })
        .catch(err => response.status(401).json({
            error: err.message,
            message: 'Something went wrong'
        }))
})

app.get('/api/persons/:id', (request, response) => {
    const personId = request.params.id

    Person
        .findById(personId)
        .then(person => response.json(person))
        .catch(err => response.status(404).json({
            error: err.message,
            message: 'No person found with specified id'
        }))
})

app.delete('/api/persons/:id', (request, response) => {

    const personId = request.params.id

    Person
        .findByIdAndDelete(personId)
        .then(deletedPerson => response.status(204).end())
        .catch(err => response.status(204).end())

})

app.post('/api/persons', (request, response) => {

    const contentTypeHeader = request.get('Content-Type')

    if (contentTypeHeader !== 'application/json')
        return response.status(400).json({
            error: 'Person data is expected in JSON format'
        })

    const { name, number } = request.body

    if (!name || !number) return response.status(400).json({
        error: "Person's name and number are required"
    })

    Person
        .exists({ number: number })
        .then(existingPersonId => {

            if (existingPersonId) return response.status(400).json({
                error: `Person ${name} already exists in the phonebook`
            })

            const newPerson = new Person({
                name,
                number,
            })

            newPerson.save().then(newPerson => response.json(newPerson))
        })


})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})