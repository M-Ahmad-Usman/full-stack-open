import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, Container, AppBar } from '@mui/material'
import { useDispatch } from 'react-redux'
import Toolbar from '@mui/material/Toolbar'

// Components
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'

// Services
import loginService from './services/login'
import blogService from './services/blogs'

// Thunks
import { renderNotification } from './reducers/notificationReducer'
import { initializeBlogs, addBlog } from './reducers/blogReducer'

const App = () => {
  const [loggedInUser, setloggedInUser] = useState(undefined)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const storedUserData = localStorage.getItem('loggedInUser')
    if (storedUserData) {
      const user = JSON.parse(storedUserData)
      setloggedInUser(user)
      blogService.setToken(user.accessToken)
    }
  }, [])

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

  const isUserLoggedIn = loggedInUser === undefined
  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar style={{ display: 'flex' }}>
          <Button color="inherit" component={Link} to="/" sx={style}>
            Blog App
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ style, marginLeft: 'auto' }}
          >
            blogs
          </Button>
          {isUserLoggedIn || (
            <Button color="inherit" component={Link} to="/create" sx={style}>
              new blog
            </Button>
          )}
          {isUserLoggedIn ? (
            <Button color="inherit" component={Link} to="/login" sx={style}>
              login
            </Button>
          ) : (
            <Button color="inherit" onClick={logOutUser}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isUserLoggedIn || (
        <div style={{ margin: '8px 0px' }}>
          {loggedInUser.username} logged in
        </div>
      )}

      <Notification />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route
            path="/blogs/:id"
            element={<Blog loggedInUser={loggedInUser} />}
          ></Route>
          <Route
            path="/create"
            element={<BlogForm createBlog={blogService.create} />}
          />
          <Route
            path="/login"
            element={
              <LoginForm
                login={loginService.login}
                onSuccess={onSuccessfullLogin}
              />
            }
          />
          <Route
            path="*"
            element={
              <p style={{ fontWeight: 'bold', fontSize: '2rem' }}>
                404 - Page not found
              </p>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
