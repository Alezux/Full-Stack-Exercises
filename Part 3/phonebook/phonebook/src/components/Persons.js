import React from 'react'

const Persons = ({persons, searchName, deletePerson}) => {
    return (
        persons.length ?
        <ul style={{listStyle: 'none', padding: 0}}>
            {
                persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))
                .map(person => (
                    <li key={person.name}>
                        {person.name} {person.number} &nbsp;
                        <button onClick={() => deletePerson(person.id, person.name)}>Delete</button>
                    </li>
                ))
            }
        </ul>
        :
        <p>Loading contacts...</p>
    )
}

export default Persons
