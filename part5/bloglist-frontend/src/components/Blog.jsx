
import { useState } from "react"

const Blog = (props) => {

  const { blog, likeBlog, deleteBlog } = props

  const [showDetails, setShowDetails] = useState(false)


  // Hide when details are visible
  const hideWhenVisible = { display: showDetails ? 'none' : 'block' }
  const showWhenVisible = { display: showDetails ? 'block' : 'none' }

  const toggleVisbility = () => setShowDetails(!showDetails)

  const buttonLabel = showDetails ? 'Hide' : 'View'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisbility}>{buttonLabel}</button>
      </div>

      <div style={showWhenVisible}>
        <b>Title:</b> {blog.title} <button onClick={toggleVisbility}>{buttonLabel}</button> <br />
        <b>Author</b> {blog.author} <br />
        <b>URL</b> {blog.url} <br />
        <b>Likes:</b> {blog.likes} <button onClick={() => likeBlog(blog)}>Like</button> <br />
        <button onClick={() => deleteBlog(blog)}>Remove</button>
      </div>
    </div>
  )
}

export default Blog