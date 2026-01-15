import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const AdminLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md transition ${
      isActive
        ? 'bg-gray-800 text-green-400 border-l-4 border-green-500'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 🔒 SIDEBAR (LOCKED) */}
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col shrink-0">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        {/* Sidebar nav (scrolls if too long) */}
        <nav className="space-y-2 flex-1 overflow-y-auto pr-1">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            Orders
          </NavLink>
        </nav>

        {/* LOGOUT FIXED AT BOTTOM */}
        <button
          onClick={handleLogout}
          className="mt-4 mb-8 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </aside>

      {/*  RIGHT SIDE (ONLY THIS SCROLLS) */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
