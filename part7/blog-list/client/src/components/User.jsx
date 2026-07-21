import { useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'

const User = () => {
  const match = useMatch('/users/:name')
  const userBlogs = useSelector((state) => {
    console.log(match.params.name)
    const user = state.users.find((user) => user.name === match.params.name)
    return user ? user.blogs : []
  })

  if (userBlogs.length === 0) return <p>User not found</p>

  return (
    <>
      <h1>added blogs</h1>
      {userBlogs.map((userBlog) => (
        <li key={userBlog.title}>{userBlog.title}</li>
      ))}
    </>
  )
}

export default User
