import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'
import { useDispatch } from 'react-redux'

// Thunks
import { addBlog } from '../reducers/blogReducer'
import { renderNotification } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'

// Hooks
import useField from '../hooks/useField'
import { getInputFields } from '../hooks/useField'

const BlogForm = () => {
  const titleField = useField('Title')
  const authorField = useField('Author')
  const urlField = useField('URL')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const resetForm = () => {
    titleField.reset()
    authorField.reset()
    urlField.reset()
  }

  const handleBlogSubmit = (event) => {
    const form = event.target

    form.reportValidity()

    event.preventDefault()

    if (
      titleField.value.trim() === '' ||
      authorField.value.trim() === '' ||
      urlField.value.trim() === ''
    ) {
      dispatch(
        renderNotification({
          message: 'title, author and url are required',
          type: 'info',
        }),
      )

      return
    }

    const newBlog = {
      title: titleField.value,
      author: authorField.value,
      url: urlField.value,
    }

    dispatch(addBlog(newBlog))
    resetForm()
    dispatch(
      renderNotification({
        message: `${titleField.value} by ${authorField.value} has been added.`,
        type: 'success',
      }),
    )
    navigate('/')
  }

  const margin = { margin: '12px 4px' }

  return (
    <div style={margin}>
      <form onSubmit={handleBlogSubmit}>
        <Stack spacing={1} sx={{ maxWidth: '320px', padding: '4px' }}>
          <TextField required {...getInputFields(titleField)} />
          <TextField required {...getInputFields(authorField)} />
          <TextField required {...getInputFields(urlField)} />

          <Button type="submit" variant="contained">
            Add Blog
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm
