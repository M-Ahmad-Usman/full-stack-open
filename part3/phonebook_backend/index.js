
const morgan = require('morgan')
const express = require('express')
const app = express()

const persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

function getRandomNumber(min = persons.length, max = 10000) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const phonebookLength = persons.length

    const markup =
        `<p>Phonebook has info of ${phonebookLength} people</p>
        <p>${new Date().toString()}</p>`

    response.send(markup)
})

app.get('/api/persons/:id', (request, response) => {
    const personId = request.params.id

    const person = persons.find(person => person.id === personId)

    if (!person) return response.status(404).end()

    return response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const personId = request.params.id

    const personIndex = persons.findIndex(person => person.id === personId)

    if (personIndex === -1) return response.status(404).end()

    persons.splice(personIndex, 1)

    return response.status(204).end()

})

app.post('/api/persons', (request, response) => {

    const contentTypeHeader = request.get('Content-Type')

    if (contentTypeHeader !== 'application/json')
        return response.status(400).json({
            error: 'Person data is expected in JSON format'
        })

    const { name, number } = request.body

    if (!name) return response.status(400).json({
        error: "Person's name is required"
    })

    if (!number) return response.status(400).json({
        error: "Person's number is required"
    })

    const alreadyExists = persons.find(person => person.name === name)

    if (alreadyExists) return response.status(400).json({
        error: `Person ${alreadyExists.name} already exists in the phonebook`
    })

    const newPerson = {
        id: getRandomNumber().toString(),
        name,
        number
    }

    persons.push(newPerson)

    return response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})