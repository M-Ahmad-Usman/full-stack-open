
import { useState, useRef } from "react"

const Blog = (props) => {

  const { blog, likeBlog, showError } = props

  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  let prevLikes = useRef(likes)

  // Hide when details are visible
  const hideWhenVisible = { display: showDetails ? 'none' : 'block' }
  const showWhenVisible = { display: showDetails ? 'block' : 'none' }

  const toggleVisbility = () => setShowDetails(!showDetails)

  const onBlogLike = async () => {
    prevLikes = likes
    setLikes(likes + 1)

    try {
      likeBlog(blog)
    }
    catch (error) {
      setLikes(prevLikes)
      console.error(error)
      showError(`Cannot like blog. Something went wrong.`, 3000)
    }

  }

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
        <b>Likes:</b> {likes} <button onClick={onBlogLike}>Like</button> <br />
      </div>
    </div>
  )
}

export default Blog