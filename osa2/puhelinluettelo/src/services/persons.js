import axios from 'axios'

const baseUrl = '/api/persons'
const getAll = () => {
    //console.log("get all")
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}
const create = newObject => {
    console.log("create")
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}
const updatePerson = (id, newObject) => {
    console.log("update")
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
  }  
const deletePerson = id => {
    console.log("delete")
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}
const personServices = { getAll, create, updatePerson, deletePerson }

export default  personServices 