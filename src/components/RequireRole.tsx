import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { UserRole } from '../types'
import type { ReactNode } from 'react'

interface RequireRoleProps {
  allowedRoles: UserRole[]
  children: ReactNode
}

const RequireRole = ({
  allowedRoles,
  children,
}: RequireRoleProps) => {
  const { authReady, role } = useAuth()

  if (!authReady) return null

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default RequireRole
