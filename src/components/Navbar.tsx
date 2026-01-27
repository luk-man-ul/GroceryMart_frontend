import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Search, ShoppingCart, User } from "lucide-react"
import { useAuth } from "../auth/AuthContext"
import { useCart } from "../cart/CartContext"

const Navbar = () => {
  const { token } = useAuth()
  const { items } = useCart()
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const cartCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const navItems = [
    { label: "Home", to: "/" },
    { label: "All Products", to: "/products" },
    { label: "Deals", to: "/deals" },
    { label: "New Arrivals", to: "/new-arrivals" },
    { label: "About Us", to: "/AboutUs" },
  ]

  if (token) {
    navItems.push({ label: "My Orders", to: "/orders" })
  }

  return (
    <header className="w-full  bg-gray-100 sticky top-0 z-[999]">
      
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        
        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wide text-green-700 hover:scale-105 transition"
        >
          Super<span className="text-orange-500">Market</span>
        </Link>

        {/* DELIVERY */}
        {/* <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} />
          <span>
            Delivery to <span className="font-semibold text-gray-800">Your Area</span>
          </span>
        </div> */}

        {/* SEARCH */}
        <div className="flex-1">
          <div className="relative max-w-2xl border rounded-full mx-auto">
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && search.trim()) {
                  navigate(`/products?search=${encodeURIComponent(search)}`)
                }
              }}
              className="w-full rounded-full bg-gray-100 px-5 py-3 pr-12 outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={() => {
                if (search.trim()) {
                  navigate(`/products?search=${encodeURIComponent(search)}`)
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* ACCOUNT + CART */}
        <div className="flex items-center gap-6">
          <Link
            to={token ? "/account" : "/login"}
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-green-700 transition"
          >
            <User size={18} />
            <span className="hidden sm:inline">
              {token ? "Account" : "Login"}
            </span>
          </Link>

          <Link
            to="/cart"
            className="relative hover:scale-110 transition"
          >
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MENU PILLS (LIKE YOUR IMAGE) */}
      <div>
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center gap-3 flex-wrap">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                }
                `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Navbar
