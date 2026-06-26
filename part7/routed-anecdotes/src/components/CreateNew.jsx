import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const CreateNew = ({ addAnecdote }) => {

  const contentField = useField('text')
  const authorField = useField('text')
  const infoField = useField('text')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newAnecdote = {
      content: contentField.value,
      author: authorField.value,
      info: infoField.value,
      vates: 0
    }
    addAnecdote(newAnecdote)

    navigate('/')
  }

  const handleReset = () => {
    contentField.reset()
    authorField.reset()
    infoField.reset()
  }

  const getInputFields = fieldHook => { 
    return { 
      type: fieldHook.type,
      value: fieldHook.value,
      onChange: fieldHook.onChange 
    } 
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...getInputFields(contentField)} />
        </div>
        <div>
          author
          <input {...getInputFields(authorField)}/>
        </div>
        <div>
          url for more info
          <input {...getInputFields(infoField)}/>
        </div>
        <button type='submit'>create</button>
        <button type='reset' onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
