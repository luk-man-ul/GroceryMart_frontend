import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { UserRole } from '../types'

const STAFF_ROLES: UserRole[] = [
  'SHOP_STAFF',
  'INVENTORY_STAFF',
  'DELIVERY_STAFF',
  'ADMIN',
]

const StaffRoute = () => {
  const { authReady, token, role } = useAuth()

  // ⏳ Wait for auth restoration
  if (!authReady) {
    return <div className="p-6">Loading...</div>
  }

  // 🚫 Not logged in
  if (!token || !role) {
    return <Navigate to="/login" replace />
  }

  // 🚫 Logged in but not staff
  if (!STAFF_ROLES.includes(role)) {
    return <Navigate to="/" replace />
  }

  // ✅ Authorized staff
  return <Outlet />
}

export default StaffRoute
