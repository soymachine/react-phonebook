import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import phonesService from './services/phones'
import Notification from "./components/Notification";
import ErrorMessage from "./components/ErrorMessage";

function print(obj){
    console.log(obj)
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [newNotification, setNewNotification] = useState(null)
    const [newError, setNewError] = useState(null)
    const hook = () => {
        phonesService
            .getAll()
            .then(initialNotes => {
                setPersons(initialNotes)
            })

    }

    useEffect(hook, [])

    let filteredPersons = persons

    const handleNameChange = (event) => {
        //console.log(event.target.value)
        setNewName(event.target.value)
    }

    const handlePhoneChange = (event) => {
        //console.log(event.target.value)
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        //console.log(event.target.value)
        let filter = event.target.value
        setNewFilter(filter)
    }

    if(newFilter == ''){
        filteredPersons = persons
    }else{
        // Do the magic
        let filterInsensitive = newFilter.toLowerCase()
        filteredPersons = persons.filter((person) => {
            let name = person.name.toLowerCase()
            // print(name + " " + filterInsensitive + " " + (name.indexOf(filterInsensitive)))
            if(name.indexOf(filterInsensitive) != -1){
                return true
            }
            return false
        });
    }
    // print(filteredPersons)

    const addName = (event) => {
        event.preventDefault()
        // Prevent for already inserted names
        const found = persons.find((person) => person.name == newName);
        console.log("found " + found);
        if(!found){
            const newPerson = {
                name: newName,
                number: newNumber,
                id: persons.length + 1,
            }

            phonesService
                .create(newPerson)
                .then(allPhonebook => {
                    
                    // setPersons(persons.concat(newPerson))
                    setPersons(allPhonebook)
                    setNewName('')
                    setNewNumber('')

                    console.log(persons)

                    showMessageForSeconds(`Added ${newPerson.name}`)
                })


        }else{
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                // Update person
                const updatedPerson = {...found, number:newNumber}
                console.log("Updated person:")
                console.log("Updated person id:" + found.id)
                console.log(updatedPerson)
                phonesService
                    .update(found.id, updatedPerson)
                    .then(allPhonebook => {
                        console.log("All persons after update:")
                        console.log(allPhonebook)
                        setPersons(persons.map(person => person.id !== found.id ? person : updatedPerson))
                        showMessageForSeconds(`Modified ${updatedPerson.name}`)
                    })
                    .catch(error => {
                        console.log(error)
                        showErrorForSeconds(`Information of ${found.name} was already removed from server`)
                        setPersons(persons.filter(n => n.id !== found.id))
                    })
            }
        }
    }

    const deletePhone = (id)=>{
        const person = persons.find(n => n.id === id)
        if (window.confirm(`Delete ${person.name}`)) {
            phonesService
                .deleteEntry(person.id)
                .then(returnedNote => {
                    // print(returnedNote)
                    setPersons(persons.filter(person => person.id !== id))
                })
        }
    }

    const showMessageForSeconds = (message, seconds = 3000) =>{
        print("showMessageForSeconds: " + message +" seconds " + seconds)
        setNewNotification(message)

        setTimeout(() => {
            setNewNotification(null)
        }, seconds)
    }

    const showErrorForSeconds = (message, seconds = 3000) =>{
        print("showMessageForSeconds: " + message +" seconds " + seconds)
        setNewError(message)

        setTimeout(() => {
            setNewError(null)
        }, seconds)
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={newNotification}/>
            <ErrorMessage message={newError}/>
            <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
            <PersonForm
                addName={addName}
                newName={newName} handleNameChange={handleNameChange}
                newNumber={newNumber} handlePhoneChange={handlePhoneChange}
            />
            <h3>Numbers</h3>
            <Persons deletePhone={deletePhone} persons={filteredPersons}/>
        </div>
    )
}

export default App
