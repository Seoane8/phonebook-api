const express = require('express')
const {devLogger, postLogger} = require('./logs/loggers')

const MAX_RANDOM = Number.MAX_SAFE_INTEGER
const PORT = 3001 

const app = express().use(express.json())

app.use(devLogger).use(postLogger)

let persons = [
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

app.get('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (!person) {
        return next()
    }

    response.json(person)
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    let notFound = true
    persons = persons.filter(person => person.id !== id ? true : notFound=false)

    if (notFound) {
        return next()
    }

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const personToCreate = request.body

    if (!personToCreate || !personToCreate.name || !personToCreate.tfno){
        return response.status(400).json({
            error: '\'name\' and \'tfno\' are necessary'
        })
    }

    const existentPerson = persons.find(person => person.name === personToCreate.name)

    if (existentPerson){
        return response.status(409).json({
            error: `person name (${existentPerson.name}) already exists`
        })
    }

    const newPerson = {
        ...personToCreate,
        id: Math.round(Math.random() * MAX_RANDOM)
    }

    persons = [...persons, newPerson]

    response.status(201).end()
})

app.use((request, response) => {
    response.status(404).json({
        error: 'not found'
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})