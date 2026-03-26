
import { useSelector } from 'react-redux'


const Notification = () => {

  const notificationMsg = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return <div style={style}>{notificationMsg}</div>
}

export default Notification
