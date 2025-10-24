
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})