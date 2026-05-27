
// Components
import Blog from './Blog'
// import LoginForm from './components/LoginForm'
// import BlogForm from './components/BlogForm'
// import Notification from './components/Notification'
// import Toggleable from './components/Toggleable'

// Services
// import blogService from './services/blogs'
// import loginservice from './services/login'

const BlogList = ({ blogs }) => {

  // const likeBlog = async (blog) => {
  //   // 1. Update UI immediately
  //   const previousBlogs = blogs
  //   setBlogs(blogs.map(b => b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))

  //   // 2. Sync with server
  //   try {
  //     // On Success - UI is already up to date
  //     await blogService.like(blog)
  //   }
  //   catch (error) {
  //     // 3. Revert back on failure
  //     console.error(error.message)
  //     setBlogs(previousBlogs)
  //     showError('Could not like blog', 2500)
  //   }
  // }

  // const deleteBlog = async (blogToDelete) => {

  //   const confirmDelete = confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)

  //   if (!confirmDelete)
  //     return

  //   try {
  //     await blogService.deleteBlog(blogToDelete)
  //     setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
  //     showNotification('Blog deleted successfully')
  //   }
  //   catch (error) {
  //     const respondedErrorMessage = error.response.data.error
  //     const statusCode = error.response.status

  //     if (statusCode === 403 && respondedErrorMessage.includes('authorize')) {
  //       showNotification("You can only delete notes which you've created.", false, 3000)
  //       return
  //     }

  //     console.error(error)
  //     showError('Something went wrong. Cannot delete blog.')
  //   }
  // }

  // Blog Form event handler
  // const onSuccessfullBlogCreation = (createdBlog) => {
  //   blogFormRef.current.toggleVisibility()
  //   setBlogs(blogs.concat(createdBlog))
  //   showNotification(`${createdBlog.title} by ${createdBlog.author} has been added.`)
  // }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <>

      <div>
        <h2>Blogs</h2>
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            // likeBlog={likeBlog}
            // deleteBlog={deleteBlog}
            user={blog.user}
          />
        )}
      </div>
    </>
  )
}

export default BlogList