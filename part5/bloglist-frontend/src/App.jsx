
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Components
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

  const showNotification = (message, isError = false, time = NOTIFICATION_TIMEOUT) => {
    setNotification({ message, isError })
    setTimeout(() => setNotification({ message: null, isError: false }), time)
  }

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