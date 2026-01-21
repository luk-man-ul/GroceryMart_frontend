import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { UserRole } from '../types'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: UserRole[]
}

// 👥 Central role groups
const STAFF_ROLES: UserRole[] = [
  'SHOP_STAFF',
  'INVENTORY_STAFF',
  'DELIVERY_STAFF',
]

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { token, role, authReady } = useAuth()
  const location = useLocation()

  // ⏳ Wait until auth state is restored
  if (!authReady) {
    return null
  }

  // 🔐 Not logged in
  if (!token || !role) {
    return <Navigate to="/login" replace />
  }

  /**
   * 🚫 HARD LOCK
   * Admin & Staff must NEVER escape their panels
   */

  // 🔒 Admin locked to /admin
  if (role === 'ADMIN' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />
  }

  // 🔒 Staff locked to /staff
  if (
    STAFF_ROLES.includes(role) &&
    !location.pathname.startsWith('/staff')
  ) {
    return <Navigate to="/staff" replace />
  }

  /**
   * 🎭 Role whitelist (extra safety for routes)
   */
  if (roles && !roles.includes(role)) {
    if (role === 'ADMIN') {
      return <Navigate to="/admin" replace />
    }

    if (STAFF_ROLES.includes(role)) {
      return <Navigate to="/staff" replace />
    }

    // USER fallback
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
