import { useEffect, useState } from 'react'
import api from '../../api/axios'

interface StockLog {
  id: number
  oldStock: number
  addedQty: number
  newStock: number
  createdAt: string
  product: {
    name: string
  }
  staff: {
    name: string
    email: string
  }
}

const AdminInventoryLogs = () => {
  const [logs, setLogs] = useState<StockLog[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')

  // Filter logs based on search and date
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const logDate = new Date(log.createdAt)
    const now = new Date()
    let matchesDate = true

    if (dateFilter === 'today') {
      matchesDate = logDate.toDateString() === now.toDateString()
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      matchesDate = logDate >= weekAgo
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      matchesDate = logDate >= monthAgo
    }
    
    return matchesSearch && matchesDate
  })

  // Get statistics
  const stats = {
    totalLogs: logs.length,
    todayLogs: logs.filter(log => 
      new Date(log.createdAt).toDateString() === new Date().toDateString()
    ).length,
    totalStockAdded: logs.reduce((sum, log) => sum + log.addedQty, 0),
    uniqueProducts: new Set(logs.map(log => log.product.name)).size,
    uniqueStaff: new Set(logs.map(log => log.staff.name)).size
  }

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/inventory/logs')
      setLogs(res.data)
    } catch (err) {
      console.error('Failed to fetch logs', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getStockChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-50'
    if (change < 0) return 'text-red-600 bg-red-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Inventory Stock Logs</h1>
          <p className="text-gray-600">Track all inventory movements and stock changes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Logs</p>
                <p className="text-2xl font-bold text-green-600">{stats.todayLogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock Added</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalStockAdded}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-orange-600">{stats.uniqueProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Staff Active</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.uniqueStaff}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Date Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  dateFilter === 'all'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  dateFilter === 'today'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('week')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  dateFilter === 'week'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setDateFilter('month')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  dateFilter === 'month'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                This Month
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products, staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
            <p className="text-gray-600">Loading inventory logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg className="mx-auto w-20 h-20 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No inventory logs found</h3>
            <p className="text-gray-500">
              {searchTerm || dateFilter !== 'all'
                ? "Try adjusting your search or date filter."
                : "No inventory movements have been recorded yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Section - Product & Staff Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        {/* Product Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                          <span className="text-lg font-bold text-orange-600">
                            {log.product.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Product & Staff Info */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{log.product.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">{log.staff.name}</span>
                            <span className="text-gray-400">•</span>
                            <span>{log.staff.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Stock Changes & Time */}
                    <div className="flex items-center gap-6">
                      {/* Stock Change */}
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-1">Stock Change</p>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${getStockChangeColor(log.addedQty)}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                          <span>+{log.addedQty}</span>
                        </div>
                      </div>

                      {/* Stock Levels */}
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-1">Stock Levels</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-semibold">
                            {log.oldStock}
                          </span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold">
                            {log.newStock}
                          </span>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-1">Time</p>
                        <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">{formatDate(log.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {!loading && filteredLogs.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredLogs.length} of {logs.length} inventory logs
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminInventoryLogs