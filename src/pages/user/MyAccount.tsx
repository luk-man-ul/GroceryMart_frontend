import { useAuth } from '../../auth/AuthContext'
import { Link } from 'react-router-dom'
import { User, Package, MapPin, Settings, HelpCircle, LogOut } from 'lucide-react'

const MyAccount = () => {
  const { role, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-14">
      <div className="max-w-6xl mx-auto px-6">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-10">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT – PROFILE CARD */}
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <User size={36} className="text-green-700" />
            </div>

            <h2 className="text-lg font-semibold mb-1">Welcome Back 👋</h2>
            <p className="text-sm text-gray-600 mb-4">Role: {role}</p>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* RIGHT – ACTION CARDS */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* MY ORDERS */}
            <Link
              to="/orders"
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <Package className="text-green-700" />
                <div>
                  <h3 className="font-semibold">My Orders</h3>
                  <p className="text-sm text-gray-600">
                    View and track your orders
                  </p>
                </div>
              </div>
            </Link>

            {/* ADDRESS BOOK */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <MapPin className="text-green-700" />
                <div>
                  <h3 className="font-semibold">Address Book</h3>
                  <p className="text-sm text-gray-600">
                    Manage delivery addresses
                  </p>
                </div>
              </div>
            </div>

            {/* ACCOUNT SETTINGS */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <Settings className="text-green-700" />
                <div>
                  <h3 className="font-semibold">Account Settings</h3>
                  <p className="text-sm text-gray-600">
                    Update account preferences
                  </p>
                </div>
              </div>
            </div>

            {/* HELP */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <HelpCircle className="text-green-700" />
                <div>
                  <h3 className="font-semibold">Help & Support</h3>
                  <p className="text-sm text-gray-600">
                    Get help with your account
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAccount
