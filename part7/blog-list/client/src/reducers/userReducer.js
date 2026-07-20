import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload.users
    },
  },
})

export const setUsers = () => async (dispatch) => {
  const users = (await userService.getUsers()).map((user) => {
    user.blogsCreated = user.blogs.length
    return user
  })
  dispatch(userSlice.actions.setUsers({ users }))
}

export default userSlice.reducer
