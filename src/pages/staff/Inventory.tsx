import { useEffect, useState } from 'react'
import api from '../../api/axios'

interface Product {
  id: number
  name: string
  stock: number
  stockType: string
  lowStock: boolean
}

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [updating, setUpdating] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'low'>('all')

  // Filter products based on search and filter type
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'low' && product.lowStock)
    
    return matchesSearch && matchesFilter
  })

  // Get statistics
  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.lowStock).length
  }

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/staff/inventory/products')
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to load inventory', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Add stock
  const addStock = async (productId: number) => {
    const qty = quantities[productId]
    if (!qty || qty <= 0) {
      alert('Enter a valid quantity')
      return
    }

    try {
      setUpdating(productId)
      await api.patch(`/staff/inventory/${productId}/add-stock`, {
        quantity: qty,
      })
      
      // Refresh inventory from backend
      await fetchProducts()
      
      // Reset input
      setQuantities(prev => ({
        ...prev,
        [productId]: 0,
      }))
    } catch (err) {
      console.error('Failed to add stock', err)
      alert('Stock update failed')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Monitor and manage your product stock levels</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-600">{stats.lowStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All Items', color: 'indigo' },
                { key: 'low', label: 'Low Stock', color: 'red' }
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setFilterType(key as any)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    filterType === key
                      ? `bg-${color}-600 text-white shadow-lg`
                      : `bg-${color}-100 text-${color}-700 hover:bg-${color}-200`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`p-6 transition-all duration-200 hover:bg-gray-50 ${
                    product.lowStock ? 'bg-red-50 border-l-4 border-red-400' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <span className="text-lg font-bold text-indigo-600">
                            {product.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Current Stock:</span>
                              <span className={`font-bold text-lg ${
                                product.lowStock ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {product.stock} {product.stockType}
                              </span>
                            </div>
                            {product.lowStock && (
                              <div className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Low Stock Alert
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add Stock Controls */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          Add Stock:
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={quantities[product.id] || ''}
                          onChange={e =>
                            setQuantities(prev => ({
                              ...prev,
                              [product.id]: Number(e.target.value),
                            }))
                          }
                          className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                          placeholder="0"
                        />
                        <span className="text-sm text-gray-500">{product.stockType}</span>
                      </div>
                      
                      <button
                        onClick={() => addStock(product.id)}
                        disabled={updating === product.id || !quantities[product.id]}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {updating === product.id ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Stock
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-6 text-center text-gray-500 text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventory