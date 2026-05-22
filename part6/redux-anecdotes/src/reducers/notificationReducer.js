
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state.message = action.payload
      return state
    },
    resetNotification(state) {
      state.message = ''
      return state
    }
  }
})

const { setNotification, resetNotification } = notificationSlice.actions

export const showNotification = (message, time) => {
  return async dispatch => {
    dispatch(setNotification(message))
    setTimeout(() => dispatch(resetNotification()), time * 1000) // specify time in seconds
  }
}

export default notificationSlice.reducer