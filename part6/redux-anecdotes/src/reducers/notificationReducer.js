
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      state.message = action.payload.message
      return state
    },
    resetNotification(state) {
      state.message = ''
      return state
    }
  }
})

export const { showNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer