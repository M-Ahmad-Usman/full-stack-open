import { useState, useEffect, useRef } from 'react'

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
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()
  let isErrorRef = useRef(false)

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

  const showNotification = (message, isError = false, time = 2500) => {
    isErrorRef = isError
    setNotification(message)
    setTimeout(() => setNotification(null), time)
  }

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const showError = (errorMessage, timeToShowError = 2500) => 
    showNotification(errorMessage, true, timeToShowError)

  // Will return a promise
  const likeBlog = (blog) => blogService.like(blog)

  // Login Form event handlers
  const onSuccessfullLogin = (loggedInUser) => {
    setUser(loggedInUser)
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    blogService.setToken(loggedInUser.accessToken)
  }
  const onUnsuccessfullLogin = (errorMessage, timeToShowError = 2500) => 
    showError(errorMessage, timeToShowError)

  // Blog Form event handlers
  const onSuccessfullBlogCreation = (createdBlog) => {
    blogFormRef.current.toggleVisibility()
    setBlogs(blogs.concat(createdBlog))
    showNotification(`${createdBlog.title} by ${createdBlog.author}`)
  }
  const onUnsuccessfullBlogCreation = (errorMessage, timeToShowError) => 
    showError(errorMessage, timeToShowError)

  // Check whether user is logged in or not
  if (user === null)
    return (
      <div>
        <h2>Login to application</h2>
        <Notification
          message={notification}
          isError={isErrorRef}
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
        isError={isErrorRef}
      />

      <div>
        <h2>User</h2>
        <p>{user.username} logged in</p>
        <button onClick={logOutUser}>Log out</button>
      </div>

      <Toggleable buttonLabel="Create New Blog" ref={blogFormRef}>
        <h2>Create New</h2>
        <BlogForm
          onSuccess={onSuccessfullBlogCreation}
          onFailure={onUnsuccessfullBlogCreation}
        />
      </Toggleable>

      <div>
        <h2>Blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} showError={showError} />
        )}
      </div>
    </>
  )
}

export default App