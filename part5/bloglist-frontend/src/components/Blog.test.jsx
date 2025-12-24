import { render, screen } from '@testing-library/react'
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