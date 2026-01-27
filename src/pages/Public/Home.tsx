import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

import heroLeft from '../../assets/home/hero-left.jpeg'
import heroMain from '../../assets/home/hero-main.jpeg'
import heroRight from '../../assets/home/hero-right.jpeg'

import freshVeg from '../../assets/home/features/fresh-veg.jpeg'
import delivery from '../../assets/home/features/delivery.jpeg'
import family from '../../assets/home/features/family.jpeg'
import HomePromos from '../../components/home/HomePromos'
import HeroSlider from "../../components/home/HeroSlider";
import FeaturedSlider from "../../components/home/featured/FeaturedSlider";
import CategoriesSlider from "../../components/home/categories/CategoriesSlider";


const Home = () => {
  const { token, role } = useAuth()

  // 🔐 ROLE-BASED HOME REDIRECT
  if (token) {
    if (role === 'ADMIN') {
      return <Navigate to="/admin" replace />
    }

    if (
      role === 'SHOP_STAFF' ||
      role === 'DELIVERY_STAFF' ||
      role === 'INVENTORY_STAFF'
    ) {
      return <Navigate to="/staff" replace />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= HERO SLIDER ================= */}
      <HeroSlider />  

      <FeaturedSlider />    

      {/* ================= HERO SECTION ================= */}
      <section className="bg-[#f6f7e7]">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

          {/* LEFT IMAGE */}
          <div className="hidden md:block">
            <img
              src={heroLeft}
              alt="Fresh Fruits"
              className="rounded-2xl shadow-md"
            />
          </div>

          {/* CENTER CONTENT */}
          <div className="text-center">
            <img
              src={heroMain}
              alt="Organic Groceries"
              className="mx-auto mb-6 rounded-2xl shadow-lg max-h-[280px]"
            />

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Fresh Groceries Delivered to Your Doorstep
            </h1>

            <p className="text-green-700 font-semibold mb-6">
              Discover real organic flavors • Up to 30% OFF
            </p>

            {!token && (
              <Link
                to="/register"
                className="inline-block bg-green-700 text-white px-10 py-3 rounded-full hover:bg-green-800 transition"
              >
                Get Started →
              </Link>
            )}

            {token && role === 'USER' && (
              <Link
                to="/products"
                className="inline-block bg-green-700 text-white px-10 py-3 rounded-full hover:bg-green-800 transition"
              >
                Shop Now →
              </Link>
            )}
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:block relative">
            <img
              src={heroRight}
              alt="Special Offer"
              className="rounded-2xl shadow-md"
            />
            <span className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              30% OFF
            </span>
          </div>
        </div>
      </section>

            <CategoriesSlider />  

 

      {/* ================= PROMO SECTION ================= */}
<HomePromos />

      {/* ================= WHY SUPERMART ================= */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          {/* LEFT IMAGE */}
          <div>
            <img
              src={freshVeg}
              alt="Fresh vegetables"
              className="rounded-2xl shadow-lg"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Why Customers Love SuperMart
            </h2>

            <div className="space-y-6">

              <div className="flex gap-5 items-start">
                <img
                  src={delivery}
                  alt="Fast delivery"
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">Fast & Reliable Delivery</h4>
                  <p className="text-gray-600 text-sm">
                    Fresh groceries delivered quickly, safely, and on time.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <img
                  src={family}
                  alt="Trusted families"
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">Trusted by Families</h4>
                  <p className="text-gray-600 text-sm">
                    Thousands of households rely on SuperMart every day.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-xl text-2xl">
                  💰
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Best Prices Guaranteed</h4>
                  <p className="text-gray-600 text-sm">
                    Affordable pricing with frequent offers and discounts.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
