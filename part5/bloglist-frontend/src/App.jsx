
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Container } from '@mui/material'

// Components
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

// Services
import loginService from './services/login'
import blogService from './services/blogs'

const NOTIFICATION_TIMEOUT = 2500

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [loggedInUser, setloggedInUser] = useState(undefined)
  const [notification, setNotification] = useState({ message: null, type: false })

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const storedUserData = localStorage.getItem('loggedInUser')
    if (storedUserData) {
      const user = JSON.parse(storedUserData)
      setloggedInUser(user)
      blogService.setToken(user.accessToken)
    }

  }, [])

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : undefined

  const showNotification = (message, type, time = NOTIFICATION_TIMEOUT) => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), time)
  }

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    setloggedInUser(undefined)
  }

  const onSuccessfullLogin = (loggedInUser) => {
    setloggedInUser(loggedInUser)
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    blogService.setToken(loggedInUser.accessToken)
    navigate('/')
  }

  // handlers
  const blogHandlers = {
    likeBlog: async function (blog) {
      // 1. Update UI immediately
      const previousBlogs = blogs
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))

      // 2. Sync with server
      try {
        await blogService.like(blog)
      }
      catch (error) {
        // 3. Revert back on failure
        console.error(error.message)
        setBlogs(previousBlogs)
        showNotification('Could not like blog', 'error', 2500)
      }
    },
    deleteBlog: async function (blogToDelete) {

      const confirmDelete = confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)

      if (!confirmDelete)
        return

      try {
        await blogService.deleteBlog(blogToDelete)
        setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
        showNotification('Blog deleted successfully', 'success')
        navigate('/')
      }
      catch (error) {
        const respondedErrorMessage = error.response.data.error
        const statusCode = error.response.status

        if (statusCode === 403 && respondedErrorMessage.includes('authorize')) {
          showNotification("You can only delete notes which you've created.", 'error', 3000)
          return
        }

        console.error(error)
        showNotification('Something went wrong. Cannot delete blog.', 'error')
        navigate('/')
      }
    }
  }

  const onSuccessfullBlogCreation = (createdBlog) => {
    setBlogs(blogs.concat(createdBlog))
    showNotification(`${createdBlog.title} by ${createdBlog.author} has been added.`, 'success')
    navigate('/')
  }

  const isUserLoggedIn = loggedInUser === undefined
  const padding = { padding: 4 }

  return (

    <Container>
      <Notification
        message={notification.message}
        type={notification.type}
      />

      <div>
        <Link style={padding} to="/">blogs</Link>
        {isUserLoggedIn || <Link style={padding} to={'/create'}>new blog</Link>}
        {
          isUserLoggedIn
            ? <Link style={padding} to="/login">login</Link>
            : <button onClick={logOutUser}>logout</button>
        }
        {isUserLoggedIn || <div>{loggedInUser.username} logged in</div>}
      </div>

      <Routes>

        <Route path='/' element={<BlogList blogs={blogs} />} />
        <Route path='/blogs/:id' element={<Blog blog={blog} blogHandlers={blogHandlers} loggedInUser={loggedInUser} />}></Route>
        <Route path='/create' element={
          <BlogForm
            createBlog={blogService.create}
            onSuccess={onSuccessfullBlogCreation}
            showNotification={showNotification}
          />}
        />
        <Route path='/login' element={
          <LoginForm
            login={loginService.login}
            onSuccess={onSuccessfullLogin}
            showNotification={showNotification}
          />}
        />

      </Routes>
    </Container>
  )

}

export default App