const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
app.use(express.static('build'))

app.use(cors())


app.use(express.json())
morgan.token('ob', function (req, res) { 
    console.log("ob", req.body)
    return `${JSON.stringify(req.body)}` })

app.use(morgan(':method :url :status :response-time :req[header] :ob'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger)

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
  ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
      response.send(`<div><p>Phonebook has info for 4 people.</p><p>${new Date()}</p></div>`)
    })


    app.get('/api/persons/:id', (req, res) =>{
        const id = req.params.id
        const person =  persons.find(person => {return person.id == id})
        console.log(person)
    
        if(person){
            res.json(person)
        }
        else{
            res.status(404).end()
        }
    })

    const generateId = () =>{
        const maxID = persons.length > 0
        ? Math.max( ...persons.map(n => n.id))
        : 0
        return maxID +1
    }
      
    app.post('/api/persons', (request, response) => {
        const body = request.body
        console.log(body)
      
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
    
        if(persons.some(person => person.name === body.name)){
            return response.status(400).json({ 
                error: 'name must be unique' 
              })
    
        }
      
        let person = {
          name: body.name,
          number: body.number,
          id: generateId(),
        }
      
        persons = persons.concat(person)
      
        response.json(person)
      })

      app.delete('/api/persons/:id', (req, res) => {
        const id = Number(req.params.id)
        persons = persons.filter(person => person.id != id)
        res.status(204).end()
    })

      const unknownEndpoint = (request, response) => {
        response.status(404).send({ error: 'unknown endpoint' })
      }
      
      app.use(unknownEndpoint)

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

      const PORT = process.env.PORT || 3001
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })