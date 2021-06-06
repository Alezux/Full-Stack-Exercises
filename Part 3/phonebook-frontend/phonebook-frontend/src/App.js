import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm.js'
import Persons from './components/Persons.js'
import Filter from './components/Filter.js'
import Notification from './components/Notification.js'
import { getAllPersons, addPerson, deletePerson, updatePerson } from './components/PersonService.js'

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ notification, setNotification ] = useState({})

  useEffect(() => {
    getAllPersons().then(persons => setPersons(persons))
  }, [])

  const notifyWithTimeout = (message, success) => {
    setNotification({message, success})
    setTimeout(() => {
      setNotification({})
    }, 3000)
  }

  const doAddPerson = (ev) => {
    ev.preventDefault()
    if(persons.map(p => p.name).includes(newName)) {
      if (window.confirm(`${newName} is already in the phonebook, replace old number with a new number?`)) {
        const existing = persons.find(p => p.name.includes(newName))
        updatePerson({...existing, number: newNumber}).then(data => setPersons(persons.filter(p => p.id !== data.id).concat(data))).then(() => notifyWithTimeout(`${newName} number was updated.`, true))
      }
    } else {
      const newPerson = {name: newName, number: newNumber}
      addPerson(newPerson).then(data => setPersons(persons.concat(data))).then(() => notifyWithTimeout(`Added ${newName} to phonebook.`, true))
    }
  }

  const byNamefilter = (person) => person.name.toLowerCase().includes(filter.toLowerCase())

  const filteredList = persons.filter(byNamefilter)

  const deleteWithConfirm = ({id, name}) => { 
    if (window.confirm(`Do you want to delete ${name} from the phonebook?`)) { 
        deletePerson(id)
          .then(() => notifyWithTimeout(`Deleted ${name} from the phonebook.`, true))
          .catch(() => notifyWithTimeout(`Person ${name} was already deleted.`, false))
        setPersons(persons.filter(p => p.id !== id))
      }
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add new number</h3>
      <PersonForm addPerson={doAddPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <Persons list={filteredList} deletePerson={deleteWithConfirm}/>
    </div>
  )

}

export default App
