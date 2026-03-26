
import { createSlice } from '@reduxjs/toolkit'

const initialState = 'app started'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationMsg(state, action) {
      return action.payload.notificationMsg
    }
  }
})

export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer