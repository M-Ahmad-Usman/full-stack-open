import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const { createBlog, onSuccess, showNotification } = props

  const resetForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleBlogSubmit = async (event) => {
    const form = event.target

    form.reportValidity()

    event.preventDefault()

    if (title.trim() === '' || author.trim() === '' || url.trim() === '') {
      showNotification('title, author and url are required', 'info', 3000)
      return
    }

    const newBlog = { title, author, url }

    try {
      const createdBlog = await createBlog(newBlog)
      resetForm()
      onSuccess(createdBlog)
    } catch (error) {
      console.error({ type: 'Blog Creation', message: error.message })
      showNotification('Something went wrong. Please try again', 'error', 2500)
    }
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
