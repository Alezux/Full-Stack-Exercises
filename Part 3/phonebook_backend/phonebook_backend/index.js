require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('post-body', (req, res) => JSON.stringify(req.body))

const morganFormatter = (tokens, req, res) => {
  const tinyConfiguration = [
    tokens.method(req,res),
    tokens.url(req,res),
    tokens.status(req,res),
    tokens.res(req,res,'content-length'),
    tokens['response-time'](req,res),
    'ms'
  ]
  if (req.method == 'POST') {
    tinyConfiguration.push(tokens['post-body'](req,res))
  }
  return tinyConfiguration.join(' ')
}

app.use(morgan(morganFormatter))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  Person.count({}).then(count => {
    res.send(`<div><p>Phonebook has info for ${count} people.</p><p>${new Date()}</p></div>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => 
{
  const id = req.params.id
  console.log(`getting person for id ${id}`)
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(person => {
      if (person) {
        res.status(200).end()
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons/', (req, res, next) => {
  const { name, number } = req.body
  const person = new Person({ name, number})
  person.save()
    .then(savedPerson => res.json(savedPerson.toJSON()))
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const id = req.params.id
  Person.findByIdAndUpdate(id, { name, number }, { new : true })
    .then(updatedPerson => res.json(updatedPerson.toJSON()))
    .catch(err => next(err))
})

const unknownEndPoint = (request, response) => {
  response.status(404).send({error : 'unknown endpoint'})
}
app.use(unknownEndPoint)

const malformedObjectIdHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({error : 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({error : error.message})
  }

  next(error)
}

app.use(malformedObjectIdHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})