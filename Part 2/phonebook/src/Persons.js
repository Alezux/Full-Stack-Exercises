import axios from 'axios'
const baseUrl = './persons'

const getAll = () => (
    axios
        .get(baseUrl)
        .then(response => response.data)
)

const create = (name, number) => (
    axios
        .post(baseUrl, {name, number})
        .then(response => response.data)
)

const remove = id => axios.delete(`${baseUrl}/${id}`)
const update = (id, updatedPerson) => (
    axios
        .put(`${baseUrl}/${id}`, updatedPerson)
        .then(response => response.data)
)

const exportedObject = {
    getAll,
    create,
    remove,
    update
};

export default exportedObject
