// FeaturedCard.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../../types'
import api from '../../../api/axios'
import { useCart } from '../../../cart/CartContext'

type Props = {
  product: Product
}

const FeaturedCard = ({ product }: Props) => {
  const [added, setAdded] = useState(false)
  const { refreshCart } = useCart()

  const sellingPrice = product.offerPrice ?? product.price
  const outOfStock = product.stock <= 0

  const discountPercent = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0

  const addToCart = async () => {
    try {
      await api.post('/cart/add', {
        productId: product.id,
        quantity: 1,
      })

      await refreshCart()
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      alert('Failed to add to cart')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-4">

{/* IMAGE + BADGE */}
<div className="relative bg-gray-50 h-44 rounded-xl overflow-hidden">
  {discountPercent > 0 && (
    <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
      {discountPercent}% OFF
    </span>
  )}

  <Link
    to={`/products/${product.id}`}
    className="w-full h-full flex items-center justify-center"
  >
    <img
      src={product.image}
      alt={product.name}
      className="max-h-32 object-contain hover:scale-110 transition-transform duration-300 ease-out group-hover:scale-105"
    />
  </Link>
</div>

      {/* Info */}
      <p className={`text-xs mt-2 ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
        {outOfStock ? 'Out of stock' : 'In stock'}
      </p>

      <h3 className="text-sm font-semibold leading-snug line-clamp-2">
        {product.name}
      </h3>

      <div className="flex items-center gap-2 mt-1">
        <span className="font-bold text-gray-900">₹ {sellingPrice}</span>
        {product.offerPrice && (
          <span className="text-xs text-gray-400 line-through">
            ₹ {product.price}
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        disabled={outOfStock}
        onClick={addToCart}
        className={`mt-3 w-full py-2 rounded-xl text-sm font-medium transition
          ${outOfStock
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
          }`}
      >
        Add to Cart
      </button>

      {added && (
        <p className="text-xs text-green-600 text-center mt-1">
          ✔ Added to cart
        </p>
      )}
    </div>
  )
}

export default FeaturedCard