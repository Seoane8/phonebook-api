require('dotenv').config()

const express = require('express')
const cors = require('cors')
const {devLogger, postLogger} = require('./logs/loggers')
const {Person} = require('./models')

const PORT = process.env.PORT

const app = express()
    .use(cors())
    .use(express.json())
app
    .use(devLogger)
    .use(postLogger)

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

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(err => next(err))
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
    const {id} = request.params
    
    Person.findByIdAndDelete(id)
        .then(() => response.status(204).end())
        .catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
    const personToCreate = request.body

    if (!personToCreate || !personToCreate.name || !personToCreate.tfno){
        return response.status(400).json({
            error: '\'name\' and \'tfno\' are necessary'
        })
    }

    /* const existentPerson = persons.find(person => person.name === personToCreate.name)

    if (existentPerson){
        return response.status(409).json({
            error: `person name (${existentPerson.name}) already exists`
        })
    } */

    const newPerson = new Person({
        name: personToCreate.name,
        tfno: personToCreate.tfno
    })

    newPerson.save()
        .then(savedPerson => response.status(201).json(savedPerson))
        .catch(err => next(err))
})

app.use((request, response) => {
    response.status(404).json({
        error: 'not found'
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})