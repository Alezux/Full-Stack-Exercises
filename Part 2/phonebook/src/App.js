import React, { useState, useRef, useEffect } from 'react'
import personService from './Persons'
import Filter from './Filter'
import PersonForm from './PersonForm'
import People from './People'
import Notification from './Notification'
import './index.css'

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ type, setType ] = useState('')
  const focusName = useRef()

  const clearInput = () => {
    setNewName('')
    setNewNumber('')
    focusName.current.focus()
  }

  useEffect(() => {
    personService.getAll()
    .then(setPersons);
  }, []);

  const addPerson = event => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) &&
      personService.update(existingPerson.id, {number: newNumber})
      .then(updatedPerson => {
        setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
        setMessage(`Updated ${newName}'s number`)
        setType('info')

        clearInput()
      })
      .catch(error => {
        if (error.name === 'TypeError') {
          setMessage(`Information of ${newName} has already been deleted`)
          setPersons(persons.filter(person => person.id !== existingPerson.id))
        } else {
          setMessage(error.response.data.error)
        }

        setType('error')
      })
    } else {
      personService.create(newName, newNumber)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setMessage(`Added ${newName}`)
        setType('info')

        clearInput();
      })
      .catch(error => {
        setMessage(error.response.data.error)
        setType('error')
      })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setMessage(`Deleted ${name}`)
        setType('info')
      })
    } 
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={type} setMessage={setMessage} setType={setType} />
      <Filter searchName={searchName} setSearchName={setSearchName} />

      <h3>Add a new</h3>
      <PersonForm newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber}
        addPerson={addPerson} focusName={focusName}
      />

      <h3>Numbers</h3>
      <People persons={persons} searchName={searchName} deletePerson={deletePerson} />
    </div>
  )
}

export default App
