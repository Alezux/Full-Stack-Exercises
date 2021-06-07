import React from 'react'

const PersonForm = ({addPerson, newName, setNewName, newNumber, setNewNumber}) =>
  <form onSubmit={addPerson}>
    <div>Name: <input value={newName} onChange={(event) => setNewName(event.target.value)}/></div>
    <div>Number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/></div>
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>

export default PersonForm