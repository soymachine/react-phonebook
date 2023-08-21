const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('object', function getId (req, resp) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))
// :method :url :status :res[content-length] - :response-time ms


let phonebook = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const max = 10000000

const generateId = () => {
    return Math.floor(Math.random() * max);
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Devuelve todo el phonebook
app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

// Devuelve el resumen del total de usuarios que hay en el phonebook
app.get('/api/info', (request, response) => {
    const date = new Date();
    let html = `<div>Phonebook has info for ${phonebook.length} people</div><br/>`
    html += `<div>${date}</div>`
    response.send(html)
})

// Agrega una nueva persona al phonebook
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    // que el nombre sea unique
    const personAlready = phonebook.find(phone => phone.name === body.name)
    if(personAlready){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }


    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    phonebook = phonebook.concat(person)

    response.json(phonebook)
})

// Extrae la información de una persona del phonebook
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(phone => phone.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Actualiza la info de una persona en el phonebook
app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(phone => phone.id === id)

    phonebook = phonebook.map(phone =>{
        if(phone.id === id){
            // Update
            updatedPhone = {
                "id": id,
                "name":phone.name,
                "number":request.params.name
            }
            return updatedPhone
        }else{
            // Nothing
            return phone
        }
    })

    if (person) {
        response.json(phonebook)
    } else {
        response.status(404).end()
    }
})

// Borra la info de una persona del phonebook
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(phone => phone.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)