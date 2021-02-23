const morgan = require('morgan')
var fs = require('fs')
var path = require('path')



morgan.token('req-body', (request) => {
    return JSON.stringify(request.body)
})

const morganFormat = ':method :url :status :res[content-length] - :response-time ms :req-body'

const postLogStream = fs.createWriteStream(path.join(__dirname, 'post.log'), { flags: 'a' })

const devLogger = morgan('dev')

const postLogger = morgan(morganFormat, {
    stream: postLogStream,
    skip: (req) => req.method !== 'POST' 
})

module.exports = {devLogger, postLogger}