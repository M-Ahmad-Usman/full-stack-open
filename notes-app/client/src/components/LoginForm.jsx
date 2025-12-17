
import { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({ onSuccessfullLogin, setErrorMessage }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginSubmit = async (event) => {

    event.preventDefault()

    const userToLogin = {
      username,
      password
    }

    loginUser(userToLogin)

  }

  const loginUser = async (userToLogin) => {
    try {
      const user = await loginService.login(userToLogin)
      onSuccessfullLogin(user)

    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <form onSubmit={handleLoginSubmit}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
