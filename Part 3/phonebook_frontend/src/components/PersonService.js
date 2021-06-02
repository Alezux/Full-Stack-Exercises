import axios from 'axios'

const getAllPersons = () => axios.get('/api/persons').then(response => response.data)

const addPerson = (data) => axios.post('/api/persons', data).then(response => response.data)

const deletePerson = (id) => axios.delete(`/api/persons/${id}`).then(response => response.data)

const updatePerson = (data) => axios.put(`/api/persons/${data.id}`, data).then(response => response.data)

export { getAllPersons, addPerson, deletePerson, updatePerson }