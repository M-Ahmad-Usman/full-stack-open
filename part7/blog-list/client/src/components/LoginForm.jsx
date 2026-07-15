import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'
import { useDispatch } from 'react-redux'
import { renderNotification } from '../reducers/notificationReducer'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const { login, onSuccess } = props

  const resetForm = () => {
    setUsername('')
    setPassword('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const form = event.target

    form.reportValidity()

    // validations
    if (
      username.trim() === '' ||
      password.trim() === '' ||
      username.length < 3 ||
      password.length < 3
    ) {
      dispatch(renderNotification({
        message:'username & password cannot be less than 3 characters',
        type: 'info'
      }, 4000))

      return
    }

    try {
      const user = await login({ username, password })
      resetForm()
      onSuccess(user)
    } catch {
      dispatch(renderNotification({ message: 'Invalid Credentials', type: 'error' }, 4000))
    }
  }

  return (
    <form id="login-form" style={{ margin: '12px 4px' }} onSubmit={handleLogin}>
      <Stack spacing={1} sx={{ maxWidth: '320px', padding: '4px' }}>
        <TextField
          label="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm
