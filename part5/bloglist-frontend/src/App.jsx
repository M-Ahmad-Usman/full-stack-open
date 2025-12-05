import { useState, useEffect } from 'react'

// Components
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'

// Services
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

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
    } catch (error) {
      console.log(error)
      alert('Invalid Credentials')
    }

  }

  // If not logged in, ask to login
  if (user === null)
    return (
      <div>
        <h2>Login to application</h2>
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    )

  return (
    <>
      <div>
        <h2>Blogs</h2>
        <p>{user.username} logged in</p>
      </div>

      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </>
  )
}

export default App