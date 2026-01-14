import { useState } from "react"
import { useAuth } from '../auth/AuthContext'
import { Link ,NavLink} from 'react-router-dom'
import { Menu, X, Search, ShoppingCart, MapPin, Phone } from "lucide-react"
import { useCart } from '../cart/CartContext'
import { useNavigate } from 'react-router-dom'


const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { token } = useAuth()
  const { items } = useCart()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const cartCount = items.reduce(   // ✅ REQUIRED
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-green-700 text-white text-sm px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer">
          <MapPin size={16} />
          <span>Select Delivery Area or Pickup Area</span>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Phone size={16} />
            <span>+91 987654321</span>
          </div>
          {!token ? (
            <Link to="/login" className="hover:underline">Login</Link>) : (
            <Link to="/account" className="hover:underline">My Account</Link>
            )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>

            <div className="text-xl font-bold text-green-700">
              Super<span className="text-red-600">Market</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 sm:flex max-w-2xl">
            <div className="relative w-full">
              <input
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={e => setSearch(e.target.value)}
  onKeyDown={e => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`)
      setOpen(false)
    }
  }}
  className="w-full bg-gray-100 rounded-full py-2 px-4 pr-12 outline-none"
/>

<button
  onClick={() => {
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`)
      setOpen(false)
    }
  }}
  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-600 text-white rounded-full p-2"
>
  <Search size={18} />
</button>

            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
           <Link
  to="/cart"
  className="relative cursor-pointer hover:scale-105 transition"
  aria-label="Go to cart"
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

        {/* Desktop Menu */}
        <nav className="hidden md:flex mt-4 gap-8 text-sm font-medium">
  <NavLink
    to="/"
    className={({ isActive }) =>
      isActive
        ? 'text-green-700 border-b-2 border-green-700 pb-1'
        : 'text-gray-700 hover:text-green-600 transition'
    }
  >
    Home
  </NavLink>

  <NavLink
    to="/products"
    className={({ isActive }) =>
      isActive
        ? 'text-green-700 border-b-2 border-green-700 pb-1'
        : 'text-gray-700 hover:text-green-600 transition'
    }
  >
    All Products
  </NavLink>

  <NavLink
    to="/deals"
    className={({ isActive }) =>
      isActive
        ? 'text-green-700 border-b-2 border-green-700 pb-1'
        : 'text-gray-700 hover:text-green-600 transition'
    }
  >
    Deals
  </NavLink>

  <NavLink
    to="/new-arrivals"
    className={({ isActive }) =>
      isActive
        ? 'text-green-700 border-b-2 border-green-700 pb-1'
        : 'text-gray-700 hover:text-green-600 transition'
    }
  >
    New Arrivals
  </NavLink>

  <NavLink
    to="/AboutUs"
    className={({ isActive }) =>
      isActive
        ? 'text-green-700 border-b-2 border-green-700 pb-1'
        : 'text-gray-700 hover:text-green-600 transition'
    }
  >
    About Us
  </NavLink>

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


        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-4 bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
            <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) =>  
                isActive   ? 'block text-green-700 font-semibold': 'block hover:text-green-600'
              }
            >
            Home
            </NavLink>
            <NavLink to="/products"  
              onClick={() => setOpen(false)}  className={({ isActive }) =>  
                isActive   ? 'block text-green-700 font-semibold': 'block hover:text-green-600'
              }
            >
            All Products
            </NavLink>
            <NavLink to="/deals" onClick={() => setOpen(false)} className={({ isActive }) =>  
                isActive   ? 'block text-green-700 font-semibold': 'block hover:text-green-600'
              }>
              Deals
            </NavLink>
            <NavLink to="/new-arrivals" onClick={() => setOpen(false)} className={({ isActive }) =>  
                isActive   ? 'block text-green-700 font-semibold': 'block hover:text-green-600'
              }>
              New Arrivals
            </NavLink>
            <NavLink to="/AboutUs" onClick={() => setOpen(false)} className={({ isActive }) =>  
                isActive   ? 'block text-green-700 font-semibold': 'block hover:text-green-600'
              }>
              About Us
            </NavLink>

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
              <Link  to="/login"  onClick={() => setOpen(false)}  className="block text-center bg-green-700 text-white py-2 rounded-lg"> 
              Login</Link>) : (
              <Link to="/account" onClick={() => setOpen(false)} className="block text-center bg-green-700 text-white py-2 rounded-lg">
              My Account</Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
