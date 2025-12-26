import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls form submit handler with correct data', async () => {

  // Data to fill in the form
  const blogData = {
    title: 'blog title',
    author: 'blog author',
    url: 'https://blog.com'
  }

  // BlogForm's labels
  const LABELS = {
    TITLE_LABEL: 'Title:',
    AUTHOR_LABEL: 'Author:',
    URL_LABEL: 'URL:'
  }

  const mockCreateBlog = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockShowErrorNotification = vi.fn()

  render(
    <BlogForm
      createBlog={mockCreateBlog}
      onSuccess={mockOnSuccess}
      showErrorNotification={mockShowErrorNotification}
    />
  )

  const formInputs = {
    titleInput: screen.getByLabelText(LABELS.TITLE_LABEL),
    authorInput: screen.getByLabelText(LABELS.AUTHOR_LABEL),
    urlInput: screen.getByLabelText(LABELS.URL_LABEL)
  }

  const event = userEvent.setup()

  // This wouldn't work
  // The characters are interleaved
  /*
    await Promise.all([
    event.type(formInputs.titleInput, blogData.title),
    event.type(formInputs.authorInput, blogData.author),
    event.type(formInputs.urlInput, blogData.url)
  ])
  */

  // Fill the form sequentially
  await event.type(formInputs.titleInput, blogData.title)
  await event.type(formInputs.authorInput, blogData.author)
  await event.type(formInputs.urlInput, blogData.url)

  const FORM_SUBMIT_BTN_TXT = 'Add Blog'
  const createBlogBtn = screen.getByText(FORM_SUBMIT_BTN_TXT)

  await event.click(createBlogBtn)

  expect(mockCreateBlog).toHaveBeenCalledWith(blogData)
})