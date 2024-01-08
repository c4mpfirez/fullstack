import { useState, useEffect } from 'react'
import personServices from './services/persons'

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
)
const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)
const Person = ({ name, number, onDelete }) => (
  <div>
    {name} {number}
    <button onClick={onDelete}>delete</button>
  </div>
)
const Persons = ({ persons, onDelete }) => (
  <>
    {persons.map(person => 
      <Person 
        key={person.id} 
        name={person.name} 
        number={person.number} 
        onDelete={() => onDelete(person.id)}
      />
    )}
  </>
)
const Notification = ({ messageObj }) => {
  if (!messageObj || !messageObj.message) {
    return null
  }
  const className = messageObj.type === 'error2' ? 'error2' : 'error1'
  return (
    <div className={className}>
      {messageObj.message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')


  useEffect(() => {
    personServices.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])
  const handleNameChange = (event) => {
    //console.log("name input:", event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    //console.log("number input:", event.target.value)
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    //console.log("search input:", event.target.value)
    setSearchTerm(event.target.value)
  }
  const handleSubmit = (event) => {
    console.log("added to db.json:", newName, "with the number:", newNumber)
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    const existing = persons.find(person => person.name === newName)
  
    if (existing) {
      if (existing.number === newNumber) {
        alert(`${newName} is already added to phonebook`)
      } else if (window.confirm(`${newName} is already added to phonebook, replace the old number?`)) {
        console.log(`updated: ${newName} with new number: ${newNumber}`)
        personServices.updatePerson(existing.id, personObject)
          .then(returned => {
            setPersons(persons.map(p => p.id !== existing.id ? p : returned))
            setNewName('')
            setNewNumber('')
            setErrorMessage({message: `Number of ${newName} is changed`, type: 'error1'})
            console.log("number changed, showing error message")
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setErrorMessage({message: `Information of ${newName} has already been removed from server`, type: 'error2'})
            } else {
              setErrorMessage({message: `Error updating ${newName}`, type: 'error2'})
            }
            console.log("error updating, showing message")
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
  } else {
    console.log(`added new: ${newName}`)
    personServices.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setErrorMessage({ message: `Added ${newName}`, type: 'error1' })
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(`[error] ${error.response.data.error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }
}
  const filteredPersons = searchTerm
    ? persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : persons

    const deletePerson = (id) => {
      const person = persons.find(p => p.id === id);
      if (person && window.confirm(`delete ${person.name}?`)) {
        personServices.deletePerson(id)
          .then(() => {
            setPersons(persons.filter(p => p.id !== id))
            setErrorMessage({ message: `${person.name} has been deleted`, type: 'error1' })
            console.log("delete registered, showing error message")
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification messageObj={errorMessage} />
      <Filter value={searchTerm} onChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onDelete={deletePerson} />
    </div>
  )
}
export default App