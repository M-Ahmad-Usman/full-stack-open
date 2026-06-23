
import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const LoginForm = (props) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { login, onSuccess, showNotification } = props

  const resetForm = () => {
    setUsername('')
    setPassword('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const form = event.target

    form.reportValidity()

    // validations
    if ((username.trim() === '' || password.trim() === '') || (username.length < 3 || password.length < 3)) {
      showNotification('username & password cannot be less than 3 characters', true, 5000)
      return
    }

    try {
      const user = await login({ username, password })
      resetForm()
      onSuccess(user)
    } catch {
      showNotification('Invalid Credentials', true, 4000)
    }
  }

  const margin = { margin: '12px 4px' }

  return (
    <div style={margin}>
      <form id="login-form" onSubmit={handleLogin}>
        <div>
          <TextField
            label='Username'
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label='Password'
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Button type='submit' variant='contained'>Login</Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
