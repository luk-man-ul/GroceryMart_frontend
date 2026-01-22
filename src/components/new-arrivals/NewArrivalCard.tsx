import { Link } from 'react-router-dom'
import badge from '../../assets/new-arrivals/badges/new-badge.jpeg'

interface Props {
  image: string
  title: string
}

const NewArrivalCard = ({ image, title }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-44 object-cover hover:scale-110 transtion-transform duration-500 ease out"
        />

        <img
          src={badge}
          alt="New"
          className="absolute top-3 left-3 w-12"
        />
      </div>

      <div className="p-4 text-center">
        <h3 className="font-semibold mb-3">{title}</h3>

        <Link
          to="/products"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded-full text-sm hover:bg-green-700 transition"
        >
          View Products
        </Link>
      </div>
    </div>
  )
}

export default NewArrivalCard
