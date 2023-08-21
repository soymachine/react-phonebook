const PersonForm = (props) => {
    let addName = props.addName
    let newName = props.newName
    let handleNameChange = props.handleNameChange
    let newNumber = props.newNumber
    let handlePhoneChange = props.handlePhoneChange
    return (
        <form onSubmit={addName}>
            <div>
                name: <input value={newName} onChange={handleNameChange} />
            </div>
            <div>number: <input value={newNumber} onChange={handlePhoneChange} /></div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm