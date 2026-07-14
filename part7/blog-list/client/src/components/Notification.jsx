import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {

  const { message, type } = useSelector(state => state.notification)

  if (message === '') {
    return null
  }

  return (
    <Alert style={{ margin: '12px 4px' }} severity={type}>
      {message}
    </Alert>
  )
}

export default Notification
