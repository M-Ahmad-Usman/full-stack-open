import {
  CardHeader,
  CardContent,
  Link,
  Stack,
  Button,
  Card,
  Typography,
} from '@mui/material'
import { useMatch, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { likeBlog, removeBlog } from '../reducers/blogReducer'

const Blog = ({ blogHandlers, loggedInUser }) => {

  const dispatch = useDispatch()
  
  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === match.params.id),
  )

  function removeBlogHandler (blogToDelete) {
    const confirmDelete = confirm(
      `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`,
    )

    if (!confirmDelete) return

    dispatch(removeBlog(blogToDelete.id))
    navigate('/')
  }

  if (!blog) return <div>Blog not found</div>

  return (
    <Card variant="elevation" sx={{ maxWidth: '300px', margin: '16px 0px' }}>
      <CardContent>
        <Stack>
          <Typography
            variant="h1"
            sx={{ fontSize: '1.5rem', margin: '8px 0px' }}
          >
            {blog.title}
          </Typography>
          <Typography>by {blog.author}</Typography>
          <Typography component={Link}>{blog.url}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Added by {blog.user.username}
          </Typography>
        </Stack>
        <Stack
          direction={'row'}
          spacing={1}
          sx={{ marginTop: '12px', alignItems: 'center' }}
        >
          <Typography>{blog.likes} likes</Typography>
          {/* Show like button to authenticated users */}
          {loggedInUser && (
            <Button
              variant="outlined"
              onClick={() => dispatch(likeBlog(blog.id))}
            >
              Like
            </Button>
          )}
          {/* Show remove button to blog owners */}
          {loggedInUser && loggedInUser.username === blog.user.username && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeBlogHandler(blog)}
            >
              Remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Blog
