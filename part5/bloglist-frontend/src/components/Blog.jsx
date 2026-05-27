
const Blog = ({ blog, blogHandlers, loggedInUser }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!blog)
    return (
      <div>Blog not found</div>
    )

  return (
    <div style={blogStyle} className='blog'>

      <div><b>Title:</b> {blog.title} </div>
      <div><b>Author:</b> {blog.author} </div>
      <div><b>URL:</b> {blog.url} </div>

      <div>
        {/* show likes to all users */}
        <b>Likes:</b> {blog.likes}
        {/* show like button only to authenticated users */}
        {loggedInUser && <button onClick={() => blogHandlers.likeBlog(blog)}>Like</button>}
      </div>

      <div><b>Added by:</b> {blog.user.username} </div>

      {/* Only authors can delete blogs */}
      {loggedInUser && loggedInUser.username === blog.user.username && <button onClick={() => blogHandlers.deleteBlog(blog)}>Remove</button>}

    </div>
  )
}

export default Blog