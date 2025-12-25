import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'
import { expect, test } from 'vitest'

test("render's blog title and author by default", () => {
  const user = { username: 'Ahmad' }

  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user
  }

  render(<Blog blog={blog} user={user} />)

  // Title and author should be visible together when the component isn't expanded
  expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeInTheDocument()

  // URL and likes should NOT be visible by default
  expect(screen.queryByText('https://reactpatterns.com/')).not.toBeInTheDocument()
  expect(screen.queryByText('7')).not.toBeInTheDocument()
})

test('all blog details are shown when component is expanded', async () => {
  const user = { username: 'Ahmad' }

  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user
  }

  render(<Blog blog={blog} user={user} />)

  const event = userEvent.setup()
  const button = screen.getByText('View')
  await event.click(button)

  expect(screen.getByText(blog.url, { exact: false })).toBeInTheDocument()
  expect(screen.getByText(blog.likes, { exact: false })).toBeInTheDocument()

})