import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import Blog from './Blog.jsx'

test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {

  const loggedInUser = undefined // unauthenticated user
  const blog = generateTestBlog({ title: 'my blog', likes: 10 })

  const mockBlogHandlers = generateMockBlogHandlers()

  render(<Blog blog={blog} blogHandlers={mockBlogHandlers} loggedInUser={loggedInUser} />)

  expect(screen.getByText(blog.title)).toBeInTheDocument()
  expect(screen.getByText('10')).toBeInTheDocument()

  expect(screen.queryAllByRole('button')).toHaveLength(0)

})

test("Authenticated users who are not the blog's creator are shown only the like button", async () => {

  const loggedInUser = generateTestUser()
  const blogAuthor = generateTestUser({ username: 'author' })
  const blog = generateTestBlog({ user: blogAuthor })

  const mockBlogHandlers = generateMockBlogHandlers()

  render(<Blog blog={blog} blogHandlers={mockBlogHandlers} loggedInUser={loggedInUser} />)

  expect(screen.getByRole('button', { name: 'Like' })).toBeDefined()
  expect(screen.getAllByRole('button')).toHaveLength(1)
})

test('Provided like blog handler prop is called when an authenticated user likes a blog', async () => {

  const loggedInUser = generateTestUser()
  const blog = generateTestBlog()

  const mockBlogHandlers = generateMockBlogHandlers()

  render(<Blog blog={blog} blogHandlers={mockBlogHandlers} loggedInUser={loggedInUser} />)

  const event = userEvent.setup()
  const likeBtn = screen.getByRole('button', { name: 'Like' })

  await event.click(likeBtn)

  expect(mockBlogHandlers.likeBlog).toBeCalled()
})

test("The blog's creator is also shown the remove button", async () => {
  const loggedInUser = generateTestUser()
  const blog = generateTestBlog({ user: loggedInUser }) // loggedIn user is the blog's creator

  const mockBlogHandlers = generateMockBlogHandlers()

  render(<Blog blog={blog} blogHandlers={mockBlogHandlers} loggedInUser={loggedInUser} />)

  expect(screen.getByRole('button', { name: 'Remove' })).toBeDefined()
})

test('Provided delete blog handler prop is called when blog creator tries to remove a blog', async () => {
  const loggedInUser = generateTestUser()
  const blog = generateTestBlog({ user: loggedInUser }) // loggedIn user is the blog's creator

  const mockBlogHandlers = generateMockBlogHandlers()

  render(<Blog blog={blog} blogHandlers={mockBlogHandlers} loggedInUser={loggedInUser} />)

  const event = userEvent.setup()
  const removeBtn = screen.getByRole('button', { name: 'Remove' })

  await event.click(removeBtn)

  expect(mockBlogHandlers.deleteBlog).toBeCalled()
})



// Utils
const generateTestUser = (user = {}) => {
  return { name: 'test user', username: `test_user_${Date.now()}`, ...user }
}

const generateTestBlog = (blog = {}) => {
  return {
    title: 'test title',
    author: 'test author',
    url: 'https://test.com/',
    likes: 0,
    user: generateTestUser(),
    ...blog
  }
}

const generateMockBlogHandlers = () => {
  const mockHandler = vi.fn()

  const mockBlogHandlers = {
    likeBlog: mockHandler,
    deleteBlog: mockHandler
  }

  return mockBlogHandlers
}