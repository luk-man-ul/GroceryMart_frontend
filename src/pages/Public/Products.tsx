import { useEffect, useState } from 'react'
import api from '../../api/axios'
import type { Product } from '../../types'
import { Link, useSearchParams } from 'react-router-dom'
import CategoryDropdown from '../../components/CategoryDropdown'
import { useCart } from '../../cart/CartContext'

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [categoryId, setCategoryId] = useState<number | null>(null)

  // Track which product was added
  const [addedProductId, setAddedProductId] = useState<number | null>(null)

  const { refreshCart } = useCart()

  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') || ''

  const hasNoResults = !loading && products.length === 0

  useEffect(() => {
    setLoading(true)

    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (categoryId) params.append('categoryId', categoryId.toString())

    api
      .get(`/products?${params.toString()}`)
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [search, categoryId])

  const addToCart = async (productId: number) => {
    try {
      await api.post('/cart/add', {
        productId,
        quantity: 1,
      })

      await refreshCart()
      setAddedProductId(productId)

      setTimeout(() => setAddedProductId(null), 2000)
    } catch {
      alert('Failed to add to cart')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <CategoryDropdown onSelect={setCategoryId} />
      </div>

      {loading && <p>Loading...</p>}

      {hasNoResults && (
        <div className="text-center py-16 text-gray-600">
          <p className="text-lg font-semibold">No products found</p>
          <p className="text-sm mt-2">
            Try searching with a different name or remove filters.
          </p>
        </div>
      )}

      {!hasNoResults && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map(product => {
            const sellingPrice = product.offerPrice ?? product.price
            const discountPercent = product.offerPrice
              ? Math.round(
                  ((product.price - product.offerPrice) / product.price) * 100
                )
              : 0

            const outOfStock = product.stock <= 0
            const isAdded = addedProductId === product.id

            return (
              <div key={product.id} className="flex justify-center">
                {/* ✅ CARD (relative is IMPORTANT) */}
                <div className="relative w-[260px] bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-4">

                  {/* ✅ DISCOUNT BADGE */}
                  {discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full z-10">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {/* IMAGE */}
                  <Link to={`/products/${product.id}`}>
                    <div className="bg-gray-50 rounded-xl p-4 h-[180px] flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                  </Link>

                  {/* STOCK */}
                  <p
                    className={`text-xs text-center mt-3 ${
                      outOfStock ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {outOfStock ? 'Out of Stock' : 'Available (In Stock)'}
                  </p>

                  {/* NAME */}
                  <h3 className="text-sm font-semibold text-center mt-2">
                    {product.name}
                  </h3>

                  {/* PRICE */}
                  <div className="flex justify-center gap-2 mt-2">
                    <span className="font-bold">₹ {sellingPrice}</span>
                    {product.offerPrice && (
                      <span className="line-through text-gray-400">
                        ₹ {product.price}
                      </span>
                    )}
                  </div>

                  {/* ADD TO CART */}
                  <button
                    disabled={outOfStock}
                    onClick={() => addToCart(product.id)}
                    className={`mt-4 w-full py-2 rounded-xl font-medium transition
                      ${
                        outOfStock
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                  >
                    Add to Cart
                  </button>

                  {/* SUCCESS MESSAGE */}
                  {isAdded && (
                    <p className="mt-2 text-center text-green-600 text-sm font-medium">
                      ✔ Added to cart
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Products
