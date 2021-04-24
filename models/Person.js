const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const personSchema = new Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
        unique: true
    },
    tfno: {
        type: String,
        minLength: 8,
        required: true,
    }
})
    
personSchema
    .plugin(uniqueValidator)
    .set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

const Person = model('Person', personSchema)

module.exports = Person