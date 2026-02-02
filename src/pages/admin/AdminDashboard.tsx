import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

type Stats = {
  products: number
  categories: number
  orders: number
  pendingOrders: number
  staff: number
}

type SalesSummary = {
  local: { revenue: number }
  online: { revenue: number }
  totalRevenue: number
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    orders: 0,
    pendingOrders: 0,
    staff: 0,
  })
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch sales summary
  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        const res = await api.get('/admin/sales/summary', {
          params: { type: 'monthly' },
        })
        setSalesSummary(res.data)
      } catch (err) {
        console.error('Failed to load sales summary', err)
      }
    }

    fetchSalesSummary()
  }, [])

  // Fetch general stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes, ordersRes, staffRes] = await Promise.all([
          api.get('admin/products'),
          api.get('/categories'),
          api.get('/orders'),
          api.get('/admin/staff'),
        ])

        const orders = ordersRes.data
        const pending = orders.filter(
          (o: any) => o.status === 'PLACED' || o.status === 'PROCESSING'
        ).length

        setStats({
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
          orders: orders.length,
          pendingOrders: pending,
          staff: staffRes.data.length,
        })
      } catch (err) {
        console.error('Failed to load dashboard stats', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🎯 Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
              <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Admin</p>
                    <p className="text-sm text-gray-500">Super User</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Summary */}
        {salesSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Local Sales (POS)</p>
                  <p className="text-3xl font-bold text-green-600">₹{salesSummary.local.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <span>In-store transactions</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Online Sales</p>
                  <p className="text-3xl font-bold text-blue-600">₹{salesSummary.online.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <span>E-commerce orders</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white/80">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">₹{salesSummary.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-white/80">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                </svg>
                <span>This month's performance</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading dashboard statistics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Products"
              value={stats.products}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              color="blue"
            />
            <StatCard
              title="Categories"
              value={stats.categories}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
              color="purple"
            />
            <StatCard
              title="Orders"
              value={stats.orders}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
              color="green"
            />
            <StatCard
              title="Staff"
              value={stats.staff}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
              color="indigo"
            />
            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="orange"
              highlight={stats.pendingOrders > 0}
            />
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavigationCard
            to="/admin/products"
            title="Products"
            description="Manage products & inventory"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            gradient="from-blue-500 to-blue-600"
          />

          <NavigationCard
            to="/admin/categories"
            title="Categories"
            description="Organize product categories"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            gradient="from-purple-500 to-purple-600"
          />

          <NavigationCard
            to="/admin/orders"
            title="Orders"
            description="Track & manage orders"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            gradient="from-green-500 to-green-600"
          />

          <NavigationCard
            to="/admin/staff"
            title="Staff Management"
            description="Manage team & permissions"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            gradient="from-indigo-500 to-indigo-600"
          />

          <NavigationCard
            to="/admin/inventory/logs"
            title="Inventory Logs"
            description="Stock movement history"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            gradient="from-teal-500 to-teal-600"
          />

          <NavigationCard
            to="/admin/sales"
            title="Sales & Reports"
            description="Analytics & revenue insights"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            gradient="from-orange-500 to-red-500"
          />
        </div>
      </div>
    </div>
  )
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  highlight = false,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  highlight?: boolean
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    indigo: 'from-indigo-500 to-indigo-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
      highlight ? 'ring-2 ring-orange-400 ring-opacity-50' : ''
    }`}>
      <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
          {highlight && (
            <div className="animate-pulse">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

const NavigationCard = ({
  to,
  title,
  description,
  icon,
  gradient,
}: {
  to: string
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
}) => (
  <Link
    to={to}
    className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
  >
    <div className={`bg-gradient-to-br ${gradient} p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
          {icon}
        </div>
        <svg className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 group-hover:text-gray-500 transition-colors">
        {description}
      </p>
    </div>
  </Link>
)

export default AdminDashboard