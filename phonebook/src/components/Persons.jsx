import PhoneNumber from './PhoneName'

const Persons = (props) => {
    let persons = props.persons

    return (
        <ul>
            {persons.map(person =>
                <PhoneNumber deletePhone={()=>{
                    props.deletePhone(person.id)
                }} key={person.id} person={person} />
            )}
        </ul>
    )
}

export default Persons