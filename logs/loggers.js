const morgan = require('morgan')



morgan.token('req-body', (request) => {
    return JSON.stringify(request.body)
})

const morganFormat = ':method :url :status :res[content-length] - :response-time ms :req-body'

const devLogger = morgan('dev')

const postLogger = morgan(morganFormat, {
    skip: (req) => req.method !== 'POST' 
})

module.exports = {devLogger, postLogger}