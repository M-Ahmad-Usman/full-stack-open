import { createSlice } from '@reduxjs/toolkit'

const NOTIFICATION_TIMEOUT = 2500

const initialState = { message: '', type: '' }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload.notification
    },
    resetNotification() {
      return initialState
    }
  }
})

const { setNotification, resetNotification } = notificationSlice.actions

export function renderNotification(notification, timeout = NOTIFICATION_TIMEOUT) {
  return dispatch => {
    dispatch(setNotification({ notification }))
    setTimeout(() => dispatch(resetNotification()), timeout)
  }
}

export default notificationSlice.reducer