import { useState, useEffect } from 'react'

// Components
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

// Services
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [isError, setIsError] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.accessToken)
    }

  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const showNotification = (message, time=2000) => {
    setNotification(message)
    setTimeout(() => setNotification(null), time)
  }

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  // Check whether user is logged in or not
  if (user === null)
    return (
      <div>
        <h2>Login to application</h2>
        <Notification 
          message={notification} 
          isError={isError}
        />
        <LoginForm
          setUser={setUser}
          setIsError={setIsError}
          showNotification={showNotification}
        />
      </div>
    )

  return (
    <>

      <Notification 
        message={notification} 
        isError={isError}
      />

      <div>
        <h2>User</h2>
        <p>{user.username} logged in</p>
        <button onClick={logOutUser}>Log out</button>
      </div>

      <div>
        <h2>Create New</h2>
        <BlogForm
          blogs={blogs}
          setBlogs={setBlogs}
          setIsError={setIsError}
          showNotification={showNotification}
        />
      </div>

      <div>
        <h2>Blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </>
  )
}

export default App