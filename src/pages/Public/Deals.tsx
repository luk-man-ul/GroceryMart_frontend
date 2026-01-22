import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

import DealsHero from '../../components/deals/DealsHero'
import DealCard from '../../components/deals/DealCard'
import DealsTrust from '../../components/deals/DealsTrust'

import fruits from '../../assets/deals/cards/fruits.jpeg'
import vegetables from '../../assets/deals/cards/vegetables.jpeg'
import meat from '../../assets/deals/cards/meat.jpeg'
import snacks from '../../assets/deals/cards/snacks.jpeg'
import dairy from '../../assets/deals/cards/dairy.jpeg'

const Deals = () => {
  const { token, role } = useAuth()

  return (
    <div className="bg-white">

      {/* HERO */}
      <DealsHero />

      {/* DEALS GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-10">
            Top Deals for You
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <DealCard image={fruits} title="Fresh Fruits" discount="30% OFF" />
            <DealCard image={vegetables} title="Vegetables" discount="25% OFF" />
            <DealCard image={meat} title="Meat & Fish" discount="20% OFF" />
            <DealCard image={snacks} title="Snacks" discount="15% OFF" />
            <DealCard image={dairy} title="Dairy Products" discount="10% OFF" />
          </div>

        </div>
      </section>

      {/* TRUST */}
      <DealsTrust />

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center border rounded-2xl py-14">

          {!token && (
            <>
              <h2 className="text-2xl font-semibold mb-3">
                Start Shopping with SuperMart
              </h2>
              <p className="text-gray-600 mb-6">
                Login or create an account to explore our deals.
              </p>

              <Link
                to="/register"
                className="bg-black text-white px-10 py-3 rounded-full"
              >
                Get Started
              </Link>
            </>
          )}

          {token && role === 'USER' && (
            <>
              <h2 className="text-2xl font-semibold mb-3">
                Welcome Back 👋
              </h2>
              <p className="text-gray-600 mb-6">
                Check out today’s best deals curated for you.
              </p>

              <Link
                to="/products"
                className="bg-green-600 text-white px-10 py-3 rounded-full"
              >
                Shop Now
              </Link>
            </>
          )}

        </div>
      </section>

    </div>
  )
}

export default Deals
