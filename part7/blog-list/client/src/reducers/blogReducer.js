import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { renderNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    initializeBlogs(state, action) {
      return action.payload.blogs
    },
    addBlog(state, action) {
      return state.concat(action.payload.blog)
    },
    likeBlog(state, action) {
      const likeBlogIdx = state.findIndex(
        (blog) => blog.id === action.payload.likeBlogId,
      )
      state[likeBlogIdx].likes += 1
    },
    dislikeBlog(state, action) {
      const dislikeBlogIdx = state.findIndex(
        (blog) => blog.id === action.payload.dislikeBlogId,
      )
      state[dislikeBlogIdx].likes -= 1
    },
    removeBlog(state, action) {
      state.filter((blog) => blog.id !== action.payload.removeBlogId)
    },
  },
})

export const initializeBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch(blogSlice.actions.initializeBlogs({ blogs }))
}

export const addBlog = (blog) => async (dispatch) => {
  const addedBlog = await blogService.create(blog)
  dispatch(blogSlice.actions.addBlog({ blog: addedBlog }))
}

export const likeBlog = (likeBlogId) => async (dispatch) => {
  dispatch(blogSlice.actions.likeBlog({ likeBlogId }))
  try {
    await blogService.likeBlog(likeBlogId)
  } catch (e) {
    dispatch(blogSlice.actions.dislikeBlog({ likeBlogId }))
    dispatch(
      renderNotification({
        message: 'Cannot like Blog. Something went wrong',
        type: 'error',
      }),
    )
    console.error(e)
  }
}

export const removeBlog = (removeBlogId) => async (dispatch) => {
  try {
    await blogService.removeBlog(removeBlogId)
    dispatch(blogSlice.actions.removeBlog({ removeBlogId }))
  } catch (error) {
    const respondedErrorMessage = error.response.data.error
    const statusCode = error.response.status
    if (statusCode === 403 && respondedErrorMessage.includes('authorize')) {
      dispatch(
        renderNotification(
          {
            message: "You can only delete notes which you've created.",
            type: 'error',
          },
          3000,
        ),
      )
    }
    return
  }
  dispatch(
    renderNotification({
      message: 'Blog deleted successfully',
      type: 'success',
    }),
  )
}

export default blogSlice.reducer