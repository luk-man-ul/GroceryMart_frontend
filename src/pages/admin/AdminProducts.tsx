import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  price: number
  offerPrice?: number | null
  stock: number
  stockType: string
  category: Category
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<Category[]>([])
  const navigate = useNavigate()

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get statistics
  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.stock < 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    onOffer: products.filter(p => p.offerPrice && p.offerPrice < p.price).length
  }

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/products', {
        params: { trash: showTrash },
      })
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (err) {
      console.error('Failed to fetch categories', err)
    }
  }

  // Delete product
  const deleteProduct = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this product?')
    if (!confirm) return

    try {
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product', err)
    }
  }

  // Restore product
  const restoreProduct = async (id: number) => {
    try {
      await api.post(`/products/${id}/restore`)
      fetchProducts()
    } catch (err) {
      console.error('Restore failed', err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [showTrash])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Product Management</h1>
            <p className="text-gray-600">Manage your product catalog and inventory</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/add')}
            className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        {!showTrash && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-xl">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">On Offer</p>
                  <p className="text-2xl font-bold text-green-600">{stats.onOffer}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowTrash(false)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  !showTrash
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active Products
              </button>
              <button
                onClick={() => setShowTrash(true)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  showTrash
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Deleted Products
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 flex-1 max-w-2xl">
              {/* Search */}
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg className="mx-auto w-20 h-20 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {showTrash 
                ? "No deleted products to show." 
                : searchTerm || selectedCategory !== 'all'
                  ? "Try adjusting your search or filter."
                  : "Start by adding your first product."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      {/* Product Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                            <span className="text-lg font-bold text-blue-600">
                              {product.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        {product.offerPrice && product.offerPrice < product.price ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">₹{product.offerPrice}</span>
                              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                                {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                              </span>
                            </div>
                            <span className="text-sm line-through text-gray-400">₹{product.price}</span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            product.stock === 0 ? 'text-red-600' : 
                            product.stock < 10 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {product.stock} {product.stockType}
                          </span>
                          {product.stock === 0 && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                              Out of Stock
                            </span>
                          )}
                          {product.stock > 0 && product.stock < 10 && (
                            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!showTrash ? (
                            <>
                              <button
                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => restoreProduct(product.id)}
                              className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

export default AdminProducts