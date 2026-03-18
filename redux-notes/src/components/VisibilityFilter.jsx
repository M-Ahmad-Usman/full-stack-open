
import { useDispatch } from "react-redux"
import { filterChange } from "../reducers/filterReducer"

const VisibilityFilter = () => {

  const dispatch = useDispatch()

  return (
    <div>

      <input
        type="radio"
        name="filter"
        id="filter-all"
        onChange={() => dispatch(filterChange('ALL'))}
      />
      <label htmlFor="filter-all">all</label>

      <input
        type="radio"
        name="filter"
        id="filter-important"
        onChange={() => dispatch(filterChange('IMPORTANT'))}
      />
      <label htmlFor="filter-important">important</label>

      <input
        type="radio"
        name="filter"
        id="filter-nonimportant"
        onChange={() => dispatch(filterChange('NONIMPORTANT'))}
      />
      <label htmlFor="filter-nonimportant">nonimportant</label>

    </div>
  )
}

export default VisibilityFilter
