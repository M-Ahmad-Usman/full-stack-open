import { useState, useEffect, useRef } from 'react'

// Components
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

// Services
import blogService from './services/blogs'

// Standard time
const NOTIFICATION_TIMEOUT = 2500

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, isError: false })

  const blogFormRef = useRef()

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

  const showNotification = (message, isError = false, time = NOTIFICATION_TIMEOUT) => {
    setNotification({ message, isError })
    setTimeout(() => setNotification({ message: null, isError: false }), time)
  }

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const showError = (errorMessage, timeToShowError = NOTIFICATION_TIMEOUT) => 
    showNotification(errorMessage, true, timeToShowError)

  const likeBlog = async (blog) => {
    // 1. Update UI immediately
    const previousBlogs = blogs
    setBlogs(blogs.map(b => b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))

    // 2. Sync with server
    try {
      // On Success - UI is already up to date
      await blogService.like(blog)
    }
    catch (error) {
      // 3. Revert back on failure
      console.error(error.message)
      setBlogs(previousBlogs)
      showError('Could not like blog', 2500)
    }
  }

  const deleteBlog = async (blogToDelete) => {

    const confirmDelete = confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)

    if (!confirmDelete)
      return

    try {
      await blogService.deleteBlog(blogToDelete)
      setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
      showNotification('Blog deleted successfuly')
    } 
    catch (error) {
      const respondedErrorMessage = error.response.data.error
      const statusCode = error.response.status
      
      if (statusCode === 403 && respondedErrorMessage.includes('authorize')) {
        showNotification(`You can only delete notes which you've created.`, false, 3000)
        return
      }

      console.error(error)
      showError('Something went wrong. Cannot delete blog.')
    }
  }

  // Login Form event handlers
  const onSuccessfullLogin = (loggedInUser) => {
    setUser(loggedInUser)
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    blogService.setToken(loggedInUser.accessToken)
  }
  const onUnsuccessfullLogin = (errorMessage, timeToShowError = NOTIFICATION_TIMEOUT) =>
    showError(errorMessage, timeToShowError)

  // Blog Form event handlers
  const onSuccessfullBlogCreation = (createdBlog) => {
    blogFormRef.current.toggleVisibility()
    setBlogs(blogs.concat(createdBlog))
    showNotification(`${createdBlog.title} by ${createdBlog.author}`)
  }
  const onUnsuccessfullBlogCreation = (errorMessage, timeToShowError) =>
    showError(errorMessage, timeToShowError)

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  // Check whether user is logged in or not
  if (user === null)
    return (
      <div>
        <h2>Login to application</h2>
        <Notification
          message={notification.message}
          isError={notification.isError}
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
        message={notification.message}
        isError={notification.isError}
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
        {sortedBlogs.map(blog =>
          <Blog 
            key={blog.id} 
            blog={blog} 
            likeBlog={likeBlog} 
            deleteBlog={deleteBlog}
          />
        )}
      </div>
    </>
  )
}

export default App