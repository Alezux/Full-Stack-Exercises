const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const dbUrl = process.env.MONGODB_URI

console.log('connecting to', dbUrl)

mongoose.connect(dbUrl, {useNewUrlParser: true})
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, minlength: 8 },
    number: { type: String, required: true, minlength: 3 }
  })

personSchema.plugin(uniqueValidator, {message : 'value for field must be unique'})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)