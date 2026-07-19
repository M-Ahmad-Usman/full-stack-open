import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { renderNotification } from '../reducers/notificationReducer'
import { loginUser } from '../reducers/loggedInUserReducer'

import useField from '../hooks/useField'
import { getInputFields } from '../hooks/useField'

const LoginForm = () => {
  const usernameField = useField('Username')
  const passwordField = useField('Password')

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const resetForm = () => {
    usernameField.reset()
    passwordField.reset()
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const form = event.target

    form.reportValidity()

    // validations
    if (
      usernameField.value.trim() === '' ||
      passwordField.value.trim() === '' ||
      usernameField.value.length < 3 ||
      passwordField.value.length < 3
    ) {
      dispatch(
        renderNotification(
          {
            message: 'username & password cannot be less than 3 characters',
            type: 'info',
          },
          4000,
        ),
      )

      return
    }

    dispatch(
      loginUser(
        { username: usernameField.value, password: passwordField.value },
        navigate,
      ),
    )
    resetForm()
  }

  return (
    <form id="login-form" style={{ margin: '12px 4px' }} onSubmit={handleLogin}>
      <Stack spacing={1} sx={{ maxWidth: '320px', padding: '4px' }}>
        <TextField required {...getInputFields(usernameField)} />
        <TextField required {...getInputFields(passwordField)} />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm
