import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/axios'
import type { Product } from '../../types'
import { useCart } from '../../cart/CartContext'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { refreshCart } = useCart()
  
  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-6">Loading...</p>
  if (!product) return <p className="p-6">Product not found</p>

  const outOfStock = product.stock <= 0
  const sellingPrice = product.offerPrice ?? product.price

  const discountPercent = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(q => q + 1)
  }

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const addToCart = async () => {
    try {
      setAdding(true)

      await api.post('/cart/add', {
        productId: product.id,
        quantity,
      })
      await refreshCart()
      alert('Added to cart')
    } catch (err) {
      console.error(err)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image */}
      <div className="bg-white border rounded-lg p-6 overflow-hidden group">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full h-80 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Details */}
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <p className="text-gray-500">
          Category:{' '}
          <span className="font-medium">{product.category.name}</span>
        </p>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold text-green-700">
            ₹ {sellingPrice}
          </span>

          {product.offerPrice && (
            <>
              <span className="line-through text-gray-400">
                ₹ {product.price}
              </span>
              <span className="text-sm text-red-600 font-medium">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {/* Stock */}
        <p
          className={`font-medium ${
            outOfStock ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {outOfStock ? 'Out of Stock' : `In Stock: ${product.stock}`}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <span className="font-medium">Quantity</span>

          <div className="flex items-center border rounded">
            <button
              onClick={decreaseQty}
              className="px-3 py-1 text-lg"
              disabled={quantity === 1}
            >
              −
            </button>

            <span className="px-4">{quantity}</span>

            <button
              onClick={increaseQty}
              disabled={quantity === product.stock}
              className="px-3 py-1 text-lg disabled:text-gray-400"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <button
          disabled={outOfStock || adding}
          onClick={addToCart}
          className={`px-6 py-3 rounded text-white w-fit transition-all
            ${
              outOfStock || adding
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg'
            }`}
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>

      {/* Description */}
      <div className="md:col-span-2 border-t pt-6">
        <h2 className="text-lg font-semibold mb-2">Product Description</h2>
        <p className="text-gray-600 leading-relaxed">
          {product.description || 'No description available for this product.'}
        </p>
      </div>
    </div>
  )
}

export default ProductDetails
