
// Components
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <>

      <div>
        <h2>Blogs</h2>
        {sortedBlogs.map(blog =>
          <li key={blog.id}>
            <Link to={`blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        )}
      </div>
    </>
  )
}

export default BlogList