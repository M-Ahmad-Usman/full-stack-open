
const LoginForm = (props) => {

  // Destructure stateful variables, their setters and form submit handler
  const { username, setUsername, password, setPassword, handleLogin } = props

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
