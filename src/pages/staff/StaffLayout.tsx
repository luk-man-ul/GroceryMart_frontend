import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const StaffLayout = () => {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Staff Panel</h2>

        <nav className="space-y-2">
          <NavLink
            to="/staff/billing"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-green-600' : 'hover:bg-gray-700'
              }`
            }
          >
            Billing (POS)
          </NavLink>
        </nav>

        <button
          onClick={logout}
          className="mt-10 bg-red-600 px-4 py-2 rounded w-full"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}

export default StaffLayout
