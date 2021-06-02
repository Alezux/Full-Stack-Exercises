const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const dbUrl = `mongodb+srv://fullstack:<password>@cluster0.abga0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(dbUrl, {useNewUrlParser: true})
const personSchema = new mongoose.Schema({name: String, number: String, id: Number})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    persons.forEach(p => console.log(p.name, p.number))
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  process.exit(1)
}

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