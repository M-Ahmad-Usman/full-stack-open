
import { useState } from "react"
import loginService from "../services/login"
import blogService from '../services/blogs'

const LoginForm = (props) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { setUser } = props

  const handleLogin = async (event) => {
    event.preventDefault()
    const form = event.target

    form.reportValidity()

    // validations
    if ((username.trim() === '' || password.trim() === '') || (username.length < 3 || password.length < 3)) {
      alert('Both password and username must be 3 characters long.')
      return
    }

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.accessToken)
    } catch {
      alert('Invalid Credentials')
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
