import React from 'react'

const Persons = ({list, deletePerson}) => <div>{list.map(person => <p key={person.name}>{person.name} {person.number} <button type="button" onClick={() => deletePerson({...person})}>delete</button></p>)}</div>

export default Persons