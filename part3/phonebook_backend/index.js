
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
        if (req.method === "POST" || req.method === "PUT") tokensArray.push(tokens.body(req, res))

        // Return formated string of predefined tokens
        return tokensArray.join(' ')
    })
)
app.use(express.static('dist'))

app.get('/api/persons', (request, response, next) => {

    Person.find({})
        .then(people => response.json(people))
        .catch(next)
})

app.get('/info', (request, response, next) => {

    Person.countDocuments({})
        .then(length => {
            const markup =
                `<p>Phonebook has info of ${length} people</p>
            <p>${new Date().toString()}</p>`

            response.send(markup)
        })
        .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
    const personId = request.params.id

    Person.findById(personId)
        .then(person => response.json(person))
        .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {

    const personId = request.params.id

    Person.findByIdAndDelete(personId)
        .then(deletedPerson => response.status(204).end())
        .catch(next)

})

app.post('/api/persons', (request, response, next) => {

    const contentTypeHeader = request.get('Content-Type')

    if (contentTypeHeader !== 'application/json')
        return response.status(400).json({
            error: 'Person data is expected in JSON format'
        })

    const { name, number } = request.body

    if (!name || !number) return response.status(400).json({
        error: "Person's name and number are required"
    })

    Person.exists({ name: name })
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
        .catch(next)


})

app.put('/api/persons/:id', (request, response, next) => {

    const { number } = request.body

    if (!number) {
        return response.status(400).json({
            error: 'Phone number is required to update the resource'
        })
    }

    const personId = request.params.id

    Person.findByIdAndUpdate(
        personId,
        { number: number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(404).json({
                    error: 'Person not found with the specified id'
                })
            }
        })
        .catch(next)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})