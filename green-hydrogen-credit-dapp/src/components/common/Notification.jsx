// This component might not be necessary if using react-toastify, but for custom if needed
import { toast } from 'react-toastify'

const Notification = ({ message, type }) => {
  useEffect(() => {
    if (message) {
      toast(message, { type })
    }
  }, [message, type])

  return null
}

export default Notification
