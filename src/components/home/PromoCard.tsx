import { Link } from 'react-router-dom'

interface PromoCardProps {
  title: string
  subtitle: string
  image: string
  bgColor: string
  buttonText?: string
  to?: string
  badgeText?: string
  reverse?: boolean
}

const PromoCard = ({
  title,
  subtitle,
  image,
  bgColor,
  buttonText = 'Shop Now',
  to = '/products',
  badgeText,
  reverse = false,
}: PromoCardProps) => {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        reverse ? 'md:flex-row-reverse' : ''
      } rounded-2xl overflow-hidden shadow-md ${bgColor}`}
    >
      {/* TEXT */}
      <div className="flex-1 p-8 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-700 mb-5">
          {subtitle}
        </p>

        <Link
          to={to}
          className="inline-block w-fit bg-white text-green-800 px-6 py-2 rounded-full font-semibold hover:bg-green-700 hover:text-white transition"
        >
          {buttonText}
        </Link>
      </div>

      {/* IMAGE */}
      <div className="relative flex-1">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

        {badgeText && (
          <span className="absolute top-4 right-4 bg-green-700 text-white text-xs px-4 py-1 rounded-full font-semibold">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  )
}

export default PromoCard
