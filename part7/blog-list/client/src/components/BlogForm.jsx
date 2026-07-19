import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useDispatch } from 'react-redux'

// Thunks
import { addBlog } from '../reducers/blogReducer'
import { renderNotification } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const resetForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleBlogSubmit = (event) => {
    const form = event.target

    form.reportValidity()

    event.preventDefault()

    if (title.trim() === '' || author.trim() === '' || url.trim() === '') {
      dispatch(
        renderNotification({
          message: 'title, author and url are required',
          type: 'info',
        }),
      )

      return
    }

    const newBlog = { title, author, url }
    dispatch(addBlog(newBlog))
    resetForm()
    dispatch(
      renderNotification({
        message: `${title} by ${author} has been added.`,
        type: 'success',
      }),
    )
    navigate('/')
  }

  const margin = { margin: '12px 4px' }

  return (
    <div style={margin}>
      <form onSubmit={handleBlogSubmit}>
        <div>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Author"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="URL"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div>
          <Button type="submit" variant="contained">
            Add Blog
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
