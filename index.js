require('dotenv').config()

const express = require('express')
const cors = require('cors')
const {devLogger, postLogger} = require('./logs/loggers')
const {Person} = require('./models')
const {unknownEndpoint, errorHandler} = require('./middlewares')

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
        .catch(next)
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
    
    Person.findByIdAndRemove(id)
        .then(() => response.status(204).end())
        .catch(next)
})

app.post('/api/persons', (request, response, next) => {
    const personToCreate = request.body

    if (!personToCreate || !personToCreate.name || !personToCreate.tfno){
        return response.status(400).json({
            error: '\'name\' and \'tfno\' are necessary'
        })
    }

    const newPerson = new Person({
        name: personToCreate.name,
        tfno: personToCreate.tfno
    })

    newPerson.save()
        .then(savedPerson => response.status(201).json(savedPerson))
        .catch(next)
})

app.put('/api/persons/:id', (request, response, next) => {
    const {id} = request.params
    const person = request.body

    Person.findByIdAndUpdate(id, person, {new: true})
        .then(updatedPerson => response.json(updatedPerson))
        .catch(next)
})

  
app.use(unknownEndpoint)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})