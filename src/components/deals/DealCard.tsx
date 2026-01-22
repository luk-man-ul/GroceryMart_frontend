import { Link } from 'react-router-dom'

interface DealCardProps {
  image: string
  title: string
  discount: string
}

const DealCard = ({ image, title, discount }: DealCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-44 object-cover hover:scale-110 transtion-transform duration-500 ease out"
        />
        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
          {discount}
        </span>
      </div>

      <div className="p-4 text-center">
        <h3 className="font-semibold mb-3">{title}</h3>

        <Link
          to="/products"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded-full text-sm hover:bg-green-700 transition"
        >
          Shop Now
        </Link>
      </div>
    </div>
  )
}

export default DealCard
