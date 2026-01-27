import { useEffect, useState } from 'react'
import api from '../../api/axios'

type Summary = {
  range: {
    start: string
    end: string
  }
  local: {
    revenue: number
    bills: number
  }
  online: {
    revenue: number
    orders: number
  }
  totalRevenue: number
}

type Filter =
  | 'CUSTOM'
  | 'TODAY'
  | 'LAST_7_DAYS'
  | 'MONTH'

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString('en-IN')}`

const toISO = (d: Date) =>
  d.toISOString().slice(0, 10)

const AdminSales = () => {
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<Filter>('TODAY')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // =========================
  // FETCH SUMMARY
  // =========================
  const fetchSummary = async (start?: string, end?: string) => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/admin/sales/summary', {
        params: start && end ? { startDate: start, endDate: end } : {},
      })
      setData(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load sales data')
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // FILTER HANDLERS
  // =========================
  const applyToday = () => {
    const today = toISO(new Date())
    setActiveFilter('TODAY')
    setStartDate(today)
    setEndDate(today)
    fetchSummary(today, today)
  }

  const applyLast7Days = () => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)
    const startISO = toISO(start)
    const endISO = toISO(end)
    setActiveFilter('LAST_7_DAYS')
    setStartDate(startISO)
    setEndDate(endISO)
    fetchSummary(startISO, endISO)
  }

  const applyMonthly = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const startISO = toISO(start)
    const endISO = toISO(now)
    setActiveFilter('MONTH')
    setStartDate(startISO)
    setEndDate(endISO)
    fetchSummary(startISO, endISO)
  }

  const applyCustom = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }
    setActiveFilter('CUSTOM')
    fetchSummary(startDate, endDate)
  }

  // DEFAULT → TODAY
  useEffect(() => {
    applyToday()
  }, [])

  // Calculate additional metrics
  const getMetrics = () => {
    if (!data) return null
    
    const totalTransactions = data.local.bills + data.online.orders
    const avgOrderValue = totalTransactions > 0 ? data.totalRevenue / totalTransactions : 0
    const localPercentage = data.totalRevenue > 0 ? (data.local.revenue / data.totalRevenue) * 100 : 0
    const onlinePercentage = data.totalRevenue > 0 ? (data.online.revenue / data.totalRevenue) * 100 : 0
    
    return {
      totalTransactions,
      avgOrderValue,
      localPercentage,
      onlinePercentage
    }
  }

  const metrics = getMetrics()

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: startDate.getFullYear() !== endDate.getFullYear() ? 'numeric' : undefined
    }
    
    if (start === end) {
      return startDate.toLocaleDateString('en-US', { ...options, year: 'numeric' })
    }
    
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💰 Sales & Revenue Analytics</h1>
          <p className="text-gray-600">Comprehensive sales performance and revenue insights</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            {/* Date Range Inputs */}
            <div className="flex gap-4 flex-1">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                onClick={applyCustom}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Apply Range
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <button
                onClick={applyToday}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeFilter === 'TODAY'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={applyLast7Days}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeFilter === 'LAST_7_DAYS'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={applyMonthly}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeFilter === 'MONTH'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                This Month
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading sales analytics...</p>
          </div>
        )}

        {/* Main Content */}
        {data && !loading && (
          <>
            {/* Date Range Display */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                </svg>
                <span className="text-gray-700 font-medium">
                  {formatDateRange(data.range.start, data.range.end)}
                </span>
              </div>
            </div>

            {/* Main Revenue Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Local POS Sales */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  {metrics && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Share</div>
                      <div className="text-lg font-bold text-green-600">{metrics.localPercentage.toFixed(1)}%</div>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🏪 Local POS Sales</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-green-600">{formatCurrency(data.local.revenue)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{data.local.bills} bills</span>
                  </div>
                  {data.local.bills > 0 && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>₹{(data.local.revenue / data.local.bills).toFixed(0)} avg</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Online Orders */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  {metrics && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Share</div>
                      <div className="text-lg font-bold text-blue-600">{metrics.onlinePercentage.toFixed(1)}%</div>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🌐 Online Orders</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-blue-600">{formatCurrency(data.online.revenue)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{data.online.orders} orders</span>
                  </div>
                  {data.online.orders > 0 && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>₹{(data.online.revenue / data.online.orders).toFixed(0)} avg</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-200 text-sm">Growth</div>
                    <div className="text-lg font-bold">+12.5%</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">💎 Total Revenue</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold">{formatCurrency(data.totalRevenue)}</span>
                </div>
                {metrics && (
                  <div className="flex items-center gap-4 text-sm text-purple-200">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      <span>{metrics.totalTransactions} transactions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>₹{metrics.avgOrderValue.toFixed(0)} avg</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Metrics */}
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.totalTransactions}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.avgOrderValue)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">POS Dominance</p>
                      <p className="text-2xl font-bold text-green-600">{metrics.localPercentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Online Share</p>
                      <p className="text-2xl font-bold text-blue-600">{metrics.onlinePercentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Breakdown Visual */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Revenue Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Local POS Sales</span>
                    <span className="text-sm font-bold text-green-600">{formatCurrency(data.local.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${metrics?.localPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Online Orders</span>
                    <span className="text-sm font-bold text-blue-600">{formatCurrency(data.online.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${metrics?.onlinePercentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg className="mx-auto w-20 h-20 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sales data available</h3>
            <p className="text-gray-500">Select a date range to view sales analytics</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSales