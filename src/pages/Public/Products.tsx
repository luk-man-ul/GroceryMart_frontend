import { useEffect, useState } from 'react'
import api from '../../api/axios'
import type { Product } from '../../types'
import CategoryDropdown from '../../components/CategoryDropdown'
import { useCart } from '../../cart/CartContext'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const [categoryId, setCategoryId] = useState<number | null>(null)

  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const [addedProductId, setAddedProductId] = useState<number | null>(null)

  const { refreshCart } = useCart()
  const [searchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const categoryFromUrl = searchParams.get('categoryId')

  const navigate = useNavigate()

  const hasNoResults = !loading && products.length === 0

  // ✅ SYNC URL → STATE (THIS IS THE FIX)
  useEffect(() => {
    if (categoryFromUrl) {
      setCategoryId(Number(categoryFromUrl))
    } else {
      setCategoryId(null)
    }
  }, [categoryFromUrl])

  const fetchProducts = async (cursor?: number, append = false) => {
  try {
    append ? setLoadingMore(true) : setLoading(true)

    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (categoryFromUrl) params.append('categoryId', categoryFromUrl)
    if (cursor) params.append('cursor', cursor.toString())
    params.append('limit', '10')

    const res = await api.get(`/products?${params.toString()}`)

    const { data, meta } = res.data

    setProducts(prev => (append ? [...prev, ...data] : data))
    setNextCursor(meta.nextCursor)
    setHasMore(meta.hasMore)
  } finally {
    setLoading(false)
    setLoadingMore(false)
  }
}


 useEffect(() => {
  setProducts([])
  setNextCursor(null)
  setHasMore(true)

  fetchProducts()
}, [search, categoryFromUrl])


  const loadMore = () => {
    if (!hasMore || loadingMore || nextCursor === null) return
    fetchProducts(nextCursor, true)
  }

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
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
<CategoryDropdown
  value={categoryId}
  onSelect={(id) => {
    if (id === null) {
      navigate('/products')
    } else {
      navigate(`/products?categoryId=${id}`)
    }
  }}
/>

      </div>

      {loading && (
        <div className="text-center py-16 text-gray-500 animate-pulse">
          Loading products…
        </div>
      )}

      {hasNoResults && (
        <div className="text-center py-24 text-gray-600">
          <p className="text-xl font-semibold">No products found</p>
          <p className="text-sm mt-2">
            Try changing your search or category.
          </p>
        </div>
      )}

      {!hasNoResults && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-gray-100
                             hover:border-gray-200 shadow-sm hover:shadow-xl
                             transition-all duration-300 overflow-hidden"
                >
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
                        className="max-h-32 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                    </Link>
                  </div>

                  <div className="p-4 flex flex-col">
                    <p
                      className={`text-xs mb-1 ${
                        outOfStock ? 'text-red-500' : 'text-green-600'
                      }`}
                    >
                      {outOfStock ? 'Out of stock' : 'In stock'}
                    </p>

                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-bold text-gray-900">
                        ₹ {sellingPrice}
                      </span>
                      {product.offerPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹ {product.price}
                        </span>
                      )}
                    </div>

                    <button
                      disabled={outOfStock}
                      onClick={() => addToCart(product.id)}
                      className={`mt-4 py-2 rounded-xl text-sm font-medium transition-all
                        ${
                          outOfStock
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                      Add to Cart
                    </button>

                    {isAdded && (
                      <p className="mt-2 text-center text-green-600 text-xs font-medium">
                        ✔ Added to cart
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 rounded-xl text-sm font-medium
                           bg-black text-white hover:bg-gray-800
                           disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loadingMore ? 'Loading…' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products
