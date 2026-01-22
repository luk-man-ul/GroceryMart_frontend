import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const StaffHome = () => {
  const { role } = useAuth()

  if (role === 'SHOP_STAFF' || role === 'ADMIN') {
    return <Navigate to="billing" replace />
  }

  if (role === 'DELIVERY_STAFF') {
    return <Navigate to="delivery" replace />
  }

  if (role === 'INVENTORY_STAFF') {
    return <Navigate to="inventory" replace />
  }

  return <Navigate to="/" replace />
}

export default StaffHome
