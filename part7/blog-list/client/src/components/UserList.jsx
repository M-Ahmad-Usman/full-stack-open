import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Paper from '@mui/material/Paper'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

// Thunks
import { setUsers } from '../reducers/userReducer'

const UserList = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setUsers())
  }, [dispatch])

  const users = useSelector((state) => state.users)

  if (!users) return <p>No users currently exists</p>

  return (
    <>
      <h1>Users</h1>
      <TableContainer component={Paper}>
        <Table aria-label="Users with their blogs">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blogs Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.username}>
                <TableCell>
                  <Link to={`/users/${encodeURIComponent(user.name)}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogsCreated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default UserList
