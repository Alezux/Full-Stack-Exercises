require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('ob', function (request, response) {
    console.log('ob', request.body)
    return `${JSON.stringify(request.body)}` })

app.use(morgan(':method :url :status :response-time :req[header] :ob'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    response.send(`<div><p>Phonebook has info for 4 people.</p><p>${new Date()}</p></div>`)
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if(person){
            response.json(person)
        }
        else{
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    Person.find({}).then(persons => {
        console.log('persons: ', persons)

        if (persons.some(person => person.name === body.name)) {
            console.log('name must be unique')
            return response.status(400).json({
                error: 'name must be unique'
            })
        }

        let person = new Person({
            name: body.name,
            number: body.number
        })

        person.save().then(savedPerson => {
            console.log('savedPerson', savedPerson)
            response.json(savedPerson)
        })

            .catch(error => next(error))
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        content: body.content,
        important: body.important,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(person => {
            if (person) {
                response.status(200).end()
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const malformedObjectIdHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error : 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error : error.message })
    }

    next(error)
}

app.use(malformedObjectIdHandler)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})