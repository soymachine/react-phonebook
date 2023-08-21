const PhoneNumber = (props) => {
    let person = props.person
    return (
        <li>
            {person.name} {person.number}
            <button onClick={props.deletePhone}>delete</button>
        </li>
    )
}

export default PhoneNumber