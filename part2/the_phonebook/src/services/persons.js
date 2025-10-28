import axios from 'axios'

const baseURL = '/api/persons';

const getAllPersons = () => {
    const request = axios.get(baseURL);
    return request.then(response => response.data);
}

const createPerson = (person) => {
    const request = axios.post(baseURL, person);
    return request.then(response => response.data);
}

const deletePerson = (deletePerson) => {
    const request = axios.delete(`${baseURL}/${deletePerson.id}`);
    return request.then(response => deletePerson);
}

const updatePerson = (updatedPerson) => {
    const request = axios.put(`${baseURL}/${updatedPerson.id}`, updatedPerson);
    return request.then(response => response.data);
}

export default { getAllPersons, createPerson, deletePerson, updatePerson }