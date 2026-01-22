import hero from '../../assets/new-arrivals/hero/new-arrivals-hero.jpeg'
import { Link } from 'react-router-dom'

const NewArrivalsHero = () => {
  return (
    <section className="bg-[#f6f7e7]">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

        {/* TEXT */}
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Fresh New Arrivals 🆕
          </h1>
          <p className="text-gray-700 mb-6 max-w-md">
            Discover freshly added products, straight from farms and brands
            you trust.
          </p>

          <Link
            to="/products"
            className="inline-block bg-green-700 text-white px-10 py-3 rounded-full hover:bg-green-800 transition"
          >
            Explore New Items →
          </Link>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src={hero}
            alt="New arrivals"
            className="rounded-3xl shadow-lg max-w-md w-full hover:scale-110 transtion-transform duration-500 ease out"
          />
        </div>

      </div>
    </section>
  )
}

export default NewArrivalsHero
