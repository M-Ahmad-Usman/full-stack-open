import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import loggedInUserReducer from './reducers/loggedInUserReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    loggedInUser: loggedInUserReducer,
    users: userReducer
  }
})

export default store