module.exports = (error, request, response, next) => {
    console.error(error.name + ' - ' + error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } 
  
    next(error)
}