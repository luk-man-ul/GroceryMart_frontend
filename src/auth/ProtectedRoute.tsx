import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { UserRole } from '../types'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: UserRole[]   
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { token, role: userRole } = useAuth()

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Role check (only if roles are provided)
  if (roles && (!userRole || !roles.includes(userRole))) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
