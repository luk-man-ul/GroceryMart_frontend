import hero from '../../assets/deals/hero/deals-hero.jpeg'
import { Link } from 'react-router-dom'

const DealsHero = () => {
  return (
    <section className="bg-[#f6f7e7]">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

        {/* TEXT */}
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Today’s Hot Deals 🔥
          </h1>
          <p className="text-gray-700 mb-6 max-w-md">
            Grab fresh groceries, daily essentials, and household items at
            unbeatable prices.
          </p>

          <Link
            to="/products"
            className="inline-block bg-green-700 text-white px-10 py-3 rounded-full hover:bg-green-800 transition"
          >
            Explore Deals →
          </Link>
        </div>

        {/* IMAGE */}
        <div>
          <img
            src={hero}
            alt="Deals"
            className="rounded-3xl shadow-lg max-w-xl w-full hover:scale-110 transform-transition duration-500 ease out"
          />
        </div>

      </div>
    </section>
  )
}

export default DealsHero
