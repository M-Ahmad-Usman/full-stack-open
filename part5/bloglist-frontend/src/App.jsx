import { useState, useEffect } from 'react'

// Components
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'

// Services
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (loggedInUser)
      setUser(JSON.parse(loggedInUser))
    
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  // Check whether user is logged in or not
  if (user === null)
    return (
      <div>
        <h2>Login to application</h2>
        <LoginForm setUser={setUser} />
      </div>
    )

  return (
    <>
      <div>
        <h2>Blogs</h2>
        <p>{user.username} logged in</p>
        <button onClick={logOutUser}>Log out</button>
      </div>

      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </>
  )
}

export default App