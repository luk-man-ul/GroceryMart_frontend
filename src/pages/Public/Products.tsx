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

  return (
    <div className="p-4">
      {/* Header + Filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <CategoryDropdown onSelect={setCategoryId} />
      </div>

      {loading && <p>Loading...</p>}

      {hasNoResults && (
        <div className="text-center py-10 text-gray-600">
          <p className="text-lg font-semibold">No products found</p>
          <p className="text-sm mt-2">
            Try searching with a different name or remove filters.
          </p>
        </div>
      )}

      {!hasNoResults && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(product => {
            const sellingPrice = product.offerPrice ?? product.price
            const discountPercent = product.offerPrice
              ? Math.round(
                  ((product.price - product.offerPrice) / product.price) * 100
                )
              : 0

            const outOfStock = product.stock <= 0

            return (
              <div key={product.id} className="flex justify-end">
                <Link
                  to={`/products/${product.id}`}
                  className="border rounded-lg p-4 w-70 bg-white hover:shadow transition relative"
                >
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {discountPercent}% OFF
                    </span>
                  )}

                  <div className="bg-white border rounded-lg overflow-hidden group">
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-65 object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>

                  <h3 className="mt-2 font-medium text-sm line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {product.stockType}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">
                      ₹ {sellingPrice}
                    </span>

                    {product.offerPrice && (
                      <span className="line-through text-sm text-gray-400">
                        ₹ {product.price}
                      </span>
                    )}
                  </div>

                  <button
                    disabled={outOfStock}
                    onClick={async e => {
                      e.preventDefault()
                      e.stopPropagation()

                      try {
                        await api.post('/cart/add', {
                          productId: product.id,
                          quantity: 1,
                        })
                        await refreshCart()
                        alert('Added to cart')
                      } catch {
                        alert('Failed to add to cart')
                      }
                    }}
                    className={`mt-1 w-full py-2 rounded text-sm font-medium transition-all duration-200 ease-in-out ${
                      outOfStock
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
                    }`}
                  >
                    {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Products
