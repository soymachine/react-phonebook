const Notification = ({ message }) => {

    if (message === null) {
        return null
    }


    const errorStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
    console.log("Aqui! " + message)
    return (
        <div style={errorStyle}>
            {message}
        </div>
    )
}

export default Notification