const mongoose = require('mongoose')

const connectionString = process.env.MONGODB_URI
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log('Database connected'))
    .catch(err => console.error(`Error connecting to database: ${err.message}`))

module.exports = {
    Person: require('./Person.js')
}