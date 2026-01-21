import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

const STAFF_ROLES = [
  'SHOP_STAFF',
  'INVENTORY_STAFF',
  'DELIVERY_STAFF',
]

const StaffRoute = () => {
  const { authReady, role } = useAuth()

  if (!authReady) return <div>Loading...</div>

  if (!role || !STAFF_ROLES.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default StaffRoute
