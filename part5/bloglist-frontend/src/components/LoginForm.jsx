
import { useState } from 'react'

const LoginForm = (props) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { login, onSuccess, showErrorNotification } = props

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
      showErrorNotification('username & password cannot be less than 3 characters')
      return
    }

    try {
      const user = await login({ username, password })
      resetForm()
      onSuccess(user)
    } catch {
      showErrorNotification('Invalid Credentials')
    }
  }

  return (
    <form id="login-form" onSubmit={handleLogin}>

      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button type="submit">Login</button>

    </form>
  )
}

export default LoginForm
