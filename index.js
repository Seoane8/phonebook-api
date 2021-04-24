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

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(numDocuments => {
            const enters = `<p>Phonebook has info for ${numDocuments} people</p>`
            const actualDate = new Date
            const date = `<p>${actualDate.toGMTString()}`
            response.send(enters+date)
        })
        .catch(next) 
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
    const {id} = request.params

    Person.findById(id)
        .then(person => person ? response.json(person) : next())
        .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
    const {id} = request.params
    
    Person.findByIdAndRemove(id)
        .then(person => person ? response.status(204).end() : next())
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
        .then(updatedPerson => updatedPerson ? response.json(updatedPerson) : next())
        .catch(next)
})

  
app.use(unknownEndpoint)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})