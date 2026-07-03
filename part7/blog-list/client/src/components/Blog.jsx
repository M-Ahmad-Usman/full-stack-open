import {
  CardHeader,
  CardContent,
  Link,
  Stack,
  Button,
  Card,
  Typography,
} from '@mui/material'

const Blog = ({ blog, blogHandlers, loggedInUser }) => {
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
              onClick={() => blogHandlers.likeBlog(blog)}
            >
              Like
            </Button>
          )}
          {/* Show remove button to blog owners */}
          {loggedInUser && loggedInUser.username === blog.user.username && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => blogHandlers.deleteBlog(blog)}
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
