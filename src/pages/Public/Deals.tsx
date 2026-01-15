import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const Deals = () => {
  const { token , role  } = useAuth()
  return (
    <div className="min-h-screen bg-gray-100">
     
{/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
           Deals
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Page Under Construction
          </p>

        </div>
      </section>

    {/* Features */}
      <h1 className="text-2xl font-semibold mt-6 mb-0 text-center">Why choose us </h1>
      <section className="max-w-6xl mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-2">🛒 Wide Product Range</h3>
            <p className="text-sm text-gray-600">
              Groceries, vegetables, fruits, snacks, and more.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-2">💰 Best Prices</h3>
            <p className="text-sm text-gray-600">
              Affordable pricing with quality products.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-2">🚚 Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Quick and reliable delivery to your home.
            </p>
          </div>
        </div>
      </section>

 {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Fresh Groceries Delivered to Your Doorstep
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Shop daily essentials, groceries, and household items at the
            best prices from your trusted supermarket.
          </p>

        </div>
      </section>

        {/* Call to Action */}
      <section className="bg-white border-t mx-auto px-4 py-16 text-center">
         {!token && (
  // PUBLIC
  <div className="border pb-8">
    <h2 className="text-2xl font-semibold mt-5 mb-3">
      Start Shopping with SuperMart
    </h2>
    <p className="text-gray-600 mb-5">
      Login or create an account to explore our products.
    </p>

    <Link
      to="/register"
      className="bg-black text-white px-8 py-2 rounded-lg"
    >
      Get Started
    </Link>
  </div>
)}

{token && role === 'USER' && (
  // USER
  <div className="border pb-8">
    <h2 className="text-2xl font-semibold mt-5 mb-3">
      Welcome back 👋
    </h2>
    <p className="text-gray-600 mb-5">
      Start adding items to your cart.
    </p>

    <Link
      to="/products"
      className="bg-green-600 text-white px-8 py-2 rounded-lg"
    >
      Shop Now
    </Link>
  </div>
)}

      </section>

      
    </div>
  )
}

export default Deals
