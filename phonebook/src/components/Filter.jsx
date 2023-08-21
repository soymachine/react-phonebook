const Filter = (props) => {
    let newFilter = props.newFilter
    let handleFilterChange = props.handleFilterChange
    return (
        <div>
            filter shown with: <input value={newFilter} onChange={handleFilterChange} />
        </div>
    )
}

export default Filter