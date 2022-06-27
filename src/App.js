import { useEffect, useState } from 'react'

import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'

import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setFiltered] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const phoneBookObject = {
      name: newName,
      number: newNumber,
    }
    if(persons.findIndex(x => x.name === phoneBookObject.name) === -1){
      personService
        .create(phoneBookObject)
        .then(returnedPerson => {
          setNotificationMessage(
            `Added ${newName}`
          )
          setTimeout(() =>{
            setNotificationMessage(null)
          }, 5000)
          setPersons(persons.concat(returnedPerson))
        })
    }
    else{
      if(window.confirm(`${phoneBookObject.name} is already added to phonebook. Replace the old number with a new one?`)){
        const target = persons.find(x => x.name === phoneBookObject.name)
        const changedNumber = { ...target, number: newNumber}
        personService
          .update(target.id, changedNumber)
          .then(response => {
            setNotificationMessage(
              `Updated ${newName}`
            )
            setTimeout(() =>{
              setNotificationMessage(null)
            }, 5000)
            setPersons(persons.map(person => person.id !== target.id ? person : response))
          })
      }
    }
    setNewName('')
    setNewNumber('')
  }

  const namesToShow = persons.filter(persons => persons.name.includes(showFiltered))

  const handleSearchChange = (event) => {
    setFiltered(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const deletePerson = (id) => {
    personService
      .deletion(id)
      .then(setPersons(persons.filter(p => p.id !== id )))
      .catch(error =>{
        setErrorMessage(
          `${id} has already been removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <Filter onChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm addName={addName} newName={newName}
      handleNameChange={handleNameChange} newNumber={newNumber}
      handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons namesToShow={namesToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App