import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

const AdminRoute = () => {
  const { authReady, role } = useAuth()

  if (!authReady) return <div>Loading...</div>

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute
