
import { useState } from "react"
import blogService from '../services/blogs'

const BlogForm = (props) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const { 
    blogs, 
    setBlogs,
    setIsError,
    showNotification
  } = props

  const resetForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleBlogSubmit = async (event) => {

    const form = event.target

    form.reportValidity()

    event.preventDefault()

    setIsError(false)

    if (title.trim() === '' || author.trim() === '' || url.trim() === '') {
      setIsError(true)
      showNotification('title, author and url are required', 3000)
      return;
    }

    const newBlog = { title, author, url }

    const createdBlog = await blogService.create(newBlog)
    resetForm()
    setBlogs(blogs.concat(createdBlog))
    showNotification(`${createdBlog.title} by ${createdBlog.author}`)
  }

  return (
    <form onSubmit={handleBlogSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          name="author"
          id="author"
          required
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="url">URL:</label>
        <input
          type="url"
          name="url"
          id="url"
          required
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
      </div>

      <button type="submit">Add Blog</button>
    </form>
  )
}

export default BlogForm
