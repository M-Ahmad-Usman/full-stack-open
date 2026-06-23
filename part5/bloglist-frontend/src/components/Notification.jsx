
import { Alert } from '@mui/material'

const Notification = (props) => {

  const { message, type } = props

  if (message === null) {
    return null
  }

  console.log(props)

  return (
    <Alert style={{ margin: '12px 4px' }} severity={type}>
      {message}
    </Alert>
  )
}

export default Notification