
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Components
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

// Services
import loginService from './services/login'
import blogService from './services/blogs'

const NOTIFICATION_TIMEOUT = 2500

const Home = () => {

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(undefined)
  const [notification, setNotification] = useState({ message: null, isError: false })

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.accessToken)
    }

  }, [])

  if (blogs.length === 0)
    return null

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : undefined

  const showNotification = (message, isError = false, time = NOTIFICATION_TIMEOUT) => {
    setNotification({ message, isError })
    setTimeout(() => setNotification({ message: null, isError: false }), time)
  }

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    setUser(undefined)
  }

  const onSuccessfullLogin = (loggedInUser) => {
    setUser(loggedInUser)
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    blogService.setToken(loggedInUser.accessToken)
    navigate('/')
  }

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
        showNotification('Could not like blog', true, 2500)
      }
    },
    deleteBlog: async function (blogToDelete) {

      const confirmDelete = confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)

      if (!confirmDelete)
        return

      try {
        await blogService.deleteBlog(blogToDelete)
        setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
        showNotification('Blog deleted successfully')
        navigate('/')
      }
      catch (error) {
        const respondedErrorMessage = error.response.data.error
        const statusCode = error.response.status

        if (statusCode === 403 && respondedErrorMessage.includes('authorize')) {
          showNotification("You can only delete notes which you've created.", false, 3000)
          return
        }

        console.error(error)
        showNotification('Something went wrong. Cannot delete blog.', true)
        navigate('/')
      }
    }
  }

  const padding = { padding: 4 }

  return (

    <>
      <Notification
        message={notification.message}
        isError={notification.isError}
      />

      <div>
        <Link style={padding} to="/">blogs</Link>
        {user === undefined
          ? <Link style={padding} to="/login">login</Link>
          : <button onClick={logOutUser}>logout</button>
        }
        {user === undefined || <div>{user.username} logged in</div>}
      </div>

      <Routes>

        <Route path='/' element={<BlogList blogs={blogs} />} />
        <Route path='/blogs/:id' element={<Blog blog={blog} blogHandlers={blogHandlers} loggedInUser={user} />}></Route>
        <Route path='/login' element={
          <LoginForm
            login={loginService.login}
            onSuccess={onSuccessfullLogin}
            showNotification={showNotification}
          />}
        />

      </Routes>
    </>
  )

}

export default Home