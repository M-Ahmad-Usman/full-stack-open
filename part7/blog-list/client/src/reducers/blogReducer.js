import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

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

export default blogSlice.reducer