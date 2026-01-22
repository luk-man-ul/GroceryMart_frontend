import { useMemo, useState, useCallback } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  MapPin,
  Phone,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../cart/CartContext'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { token } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  /**
   * 🛒 Cart count (memoized)
   */
  const cartCount = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
    [items],
  )

  /**
   * 🔍 Handle search submit
   */
  const handleSearch = useCallback(() => {
    if (!search.trim()) return

    navigate(
      `/products?search=${encodeURIComponent(
        search.trim(),
      )}`,
    )
    setOpen(false)
  }, [search, navigate])

  return (
    <header className="w-full">
      {/* ================= TOP BAR ================= */}
      <div className="bg-green-700 text-white text-sm px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer">
          <MapPin size={16} />
          <span>Select Delivery or Pickup Area</span>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Phone size={16} />
            <span>+91 987654321</span>
          </div>

          {!token ? (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          ) : (
            <Link
              to="/account"
              className="hover:underline"
            >
              My Account
            </Link>
          )}
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle navigation menu"
              className="md:hidden"
              onClick={() => setOpen(prev => !prev)}
            >
              {open ? <X /> : <Menu />}
            </button>

            <Link
              to="/"
              className="text-xl font-bold text-green-700"
              onClick={() => setOpen(false)}
            >
              Super
              <span className="text-red-600">
                Market
              </span>
            </Link>
          </div>

          {/* SEARCH */}
          <div className="flex-1 sm:flex max-w-2xl">
            <div className="relative w-full">
              <label
                htmlFor="search"
                className="sr-only"
              >
                Search products
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e =>
                  setSearch(e.target.value)
                }
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                className="w-full bg-gray-100 rounded-full py-2 px-4 pr-12 outline-none"
              />

              <button
                aria-label="Search products"
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-600 text-white rounded-full p-2"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              aria-label="Go to cart"
              className="relative hover:scale-105 transition"
            >
              <ShoppingCart />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ================= DESKTOP MENU ================= */}
        <nav className="hidden md:flex mt-4 gap-8 text-sm font-medium">
          {[
            ['/', 'Home'],
            ['/products', 'All Products'],
            ['/deals', 'Deals'],
            ['/new-arrivals', 'New Arrivals'],
            ['/aboutus', 'About Us'],
          ].map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? 'text-green-700 border-b-2 border-green-700 pb-1'
                  : 'text-gray-700 hover:text-green-600 transition'
              }
            >
              {label}
            </NavLink>
          ))}

          {token && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-700 border-b-2 border-green-700 pb-1'
                  : 'text-gray-700 hover:text-green-600 transition'
              }
            >
              My Orders
            </NavLink>
          )}
        </nav>

        {/* ================= MOBILE MENU ================= */}
        {open && (
          <div className="md:hidden mt-4 bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
            {[
              ['/', 'Home'],
              ['/products', 'All Products'],
              ['/deals', 'Deals'],
              ['/new-arrivals', 'New Arrivals'],
              ['/aboutus', 'About Us'],
            ].map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'block text-green-700 font-semibold'
                    : 'block hover:text-green-600'
                }
              >
                {label}
              </NavLink>
            ))}

            {token && (
              <NavLink
                to="/orders"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'block text-green-700 font-semibold'
                    : 'block hover:text-green-600'
                }
              >
                My Orders
              </NavLink>
            )}

            {!token ? (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block text-center bg-green-700 text-white py-2 rounded-lg"
              >
                Login
              </Link>
            ) : (
              <Link
                to="/account"
                onClick={() => setOpen(false)}
                className="block text-center bg-green-700 text-white py-2 rounded-lg"
              >
                My Account
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
