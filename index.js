const { request, response } = require('express')
const express = require('express')

const app = express()
const PORT = 3001

const persons = [
    {
        name: 'Arto Hellas',
        tfno: '040-123456',
        id: 1,
    },
    {
        name: 'Ada Lovelace',
        tfno: '39-44-5323523',
        id: 2,
    },
    {
        name: 'Dan Abramov',
        tfno: '12-43-234345',
        id: 3,
    },
    {
        name: 'Mary Poppendieck',
        tfno: '39-23-6423122',
        id: 4,
    },
]

app.get('/info', (request, response) => {
    const enters = `<p>Phonebook has info for ${persons.length} people</p>`
    const actualDate = new Date
    const date = `<p>${actualDate.toGMTString()}`
    response.send(enters+date)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (!person){
        return response.status(404).end()
    }

    response.json(person)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})