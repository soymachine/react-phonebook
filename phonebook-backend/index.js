require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('object', function getId (req, resp) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))
// :method :url :status :res[content-length] - :response-time ms
const max = 10000000

const generateId = () => {
    return Math.floor(Math.random() * max);
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Devuelve todo el phonebook
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Devuelve el resumen del total de usuarios que hay en el phonebook
app.get('/api/info', (request, response) => {

    Person.find({}).then(persons => {
        const date = new Date();
        let html = `<div>Phonebook has info for ${persons.length} people</div><br/>`
        html += `<div>${date}</div>`
        response.send(html)
    })

    
})

// Agrega una nueva persona al phonebook
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

// Extrae la información de una persona del phonebook
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if(person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    })
    .catch(error => {
        next(error)        
    })
})

// Actualiza la info de una persona en el phonebook
app.put('/api/persons/:id', (request, response, next) => {

    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }
    
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))

})

// Borra la info de una persona del phonebook
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
  
    next(error)
}
  
// this has to be the last loaded middleware.
app.use(errorHandler)