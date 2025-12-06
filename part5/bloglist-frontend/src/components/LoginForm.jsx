
import { useState } from "react"
import loginService from "../services/login"
import blogService from '../services/blogs'

const LoginForm = (props) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { setUser } = props

  const handleLogin = async (event) => {
    event.preventDefault()

    setUsername(username.trim())
    setPassword(password.trim())

    // validations
    if ((username === '' || password === '') || (username.length < 3 || password.length < 3)) {
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
          value={username}
          onChange={e => setUsername(e.target.value)}
          name="username"
          id="username"
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          name="password"
          id="password"
        />
      </div>

      <button type="submit">Login</button>

    </form>
  )
}

export default LoginForm
