import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'
import persistentUserService from '../services/persistentUser'

const loggedInUserSlice = createSlice({
  name: 'loggedInUser',
  initialState: {
    name: undefined,
    username: undefined,
    accessToken: undefined,
  },
  reducers: {
    setLoggedInUser(state, action) {
      return action.payload.loggedInUser
    },
    removeLoggedInUser(state, action) {
      return { name: undefined, username: undefined, accessToken: undefined }
    },
  },
})

export const loginUser = (user, navigate) => async (dispatch) => {
  try {
    const loggedInUser = await loginService.login(user)
    dispatch(loggedInUserSlice.actions.setLoggedInUser({ loggedInUser }))
    persistentUserService.saveUser(loggedInUser)
    blogService.setToken(loggedInUser.accessToken)
  } catch (e) {
    dispatch(
      renderNotification(
        { message: 'Invalid Credentials', type: 'error' },
        4000,
      ),
    )
  }
  navigate('/')
}

export const logoutUser = () => async (dispatch) => {
  dispatch(loggedInUserSlice.actions.removeLoggedInUser())
  persistentUserService.removeUser()
  blogService.setToken('')
}

export const { setLoggedInUser } = loggedInUserSlice.actions

export default loggedInUserSlice.reducer
