import { useState, useEffect } from 'react'

// Components
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

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

  const showNotification = (message, time = 2000) => {
    setNotification(message)
    setTimeout(() => setNotification(null), time)
  }

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  // Login Form event handlers
  const onSuccessfullLogin = (loggedInUser) => {
    setIsError(false)
    setUser(loggedInUser)
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    blogService.setToken(loggedInUser.accessToken)
  }
  const onUnsuccessfullLogin = (errorMessage) => {
    setIsError(true)
    showNotification(errorMessage, 2500)
  }

  // Blog Form event handlers
  const onSuccessfullBlogCreation = (createdBlog) => {
    setIsError(false)
    setBlogs(blogs.concat(createdBlog))
    showNotification(`${createdBlog.title} by ${createdBlog.author}`)
  }
  const onUnsuccessfullBlogCreation = (errorMessage, timeToShowError) => {
    setIsError(true)
    showNotification(errorMessage, timeToShowError ?? 2500)
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
        <Toggleable buttonLabel="login">
          <LoginForm
            onSuccess={onSuccessfullLogin}
            onFailure={onUnsuccessfullLogin}
          />
        </Toggleable>
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

      <Toggleable buttonLabel="Create New Blog">
        <h2>Create New</h2>
        <BlogForm
          onSuccess={onSuccessfullBlogCreation}
          onFailure={onUnsuccessfullBlogCreation}
        />
      </Toggleable>

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