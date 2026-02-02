import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import api from '../../api/axios'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  User,
  Package,
  MapPin,
  Settings,
  HelpCircle,
  LogOut,
  Mail,
} from 'lucide-react'

interface Profile {
  name: string
  email: string
}

const MyAccount = () => {
  const { logout, user } = useAuth() as any
  const location = useLocation()

  const [profile, setProfile] = useState<Profile | null>(
    user ?? null,
  )
  const [loading, setLoading] = useState(false)

  const isSubPage = location.pathname.includes('/account/')

  useEffect(() => {
    if (profile) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await api.get('/auth/me')
        setProfile({
          name: res.data.name,
          email: res.data.email,
        })
      } catch (err) {
        console.error('Failed to load profile', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [profile])

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-10">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT – PROFILE */}
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <User size={36} className="text-green-700" />
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">
                Loading profile...
              </p>
            ) : (
              <>
                <h2 className="text-lg font-semibold">
                  {profile?.name ?? 'User'}
                </h2>

                {profile?.email && (
                  <p className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-1">
                    <Mail size={14} />
                    {profile.email}
                  </p>
                )}
              </>
            )}

            <button
              onClick={logout}
              className="mt-5 flex items-center justify-center gap-2 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* RIGHT – CONTENT */}
          <div className="md:col-span-2">
            {/* ACTION CARDS (only on main account page) */}
            {!isSubPage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                  to="/orders"
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <Package className="text-green-700" />
                    <div>
                      <h3 className="font-semibold">
                        My Orders
                      </h3>
                      <p className="text-sm text-gray-600">
                        View and track your orders
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="addresses"
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <MapPin className="text-green-700" />
                    <div>
                      <h3 className="font-semibold">
                        Address Book
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage delivery addresses
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <Settings className="text-green-700" />
                    <div>
                      <h3 className="font-semibold">
                        Account Settings
                      </h3>
                      <p className="text-sm text-gray-600">
                        Update account preferences
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <HelpCircle className="text-green-700" />
                    <div>
                      <h3 className="font-semibold">
                        Help & Support
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get help with your account
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ NESTED ROUTES RENDER HERE (CORRECT PLACE) */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAccount
