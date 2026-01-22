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

  const [salesSummary, setSalesSummary] =
    useState<SalesSummary | null>(null)

  const [loading, setLoading] = useState(false)

  // =========================
  // FETCH SALES SUMMARY
  // =========================
 useEffect(() => {
  const fetchSalesSummary = async () => {
    try {
      const res = await api.get('/admin/sales/summary', {
        params: { type: 'monthly' }, // 👈 monthly revenue
      })
      setSalesSummary(res.data)
    } catch (err) {
      console.error('Failed to load sales summary', err)
    }
  }

  fetchSalesSummary()
}, [])


  // =========================
  // FETCH GENERAL STATS
  // =========================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        const [
          productsRes,
          categoriesRes,
          ordersRes,
          staffRes,
        ] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
          api.get('/orders'),
          api.get('/admin/staff'),
        ])

        const orders = ordersRes.data

        const pending = orders.filter(
          (o: any) =>
            o.status === 'PLACED' ||
            o.status === 'PROCESSING',
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* ================= SALES SUMMARY ================= */}
      {salesSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded shadow">
            <p className="text-sm text-gray-500">
              Local Sales (POS)
            </p>
            <p className="text-2xl font-bold text-green-600">
              ₹{salesSummary.local.revenue}
            </p>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <p className="text-sm text-gray-500">
              Online Sales
            </p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{salesSummary.online.revenue}
            </p>
          </div>

          <div className="bg-black p-5 rounded shadow text-white">
            <p className="text-sm opacity-80">
              Total Revenue (This Month)
            </p>
            <p className="text-3xl font-bold">
              ₹{salesSummary.totalRevenue}
            </p>
          </div>
        </div>
      )}

      {/* ================= STATS CARDS ================= */}
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Products"
            value={stats.products}
          />
          <StatCard
            title="Categories"
            value={stats.categories}
          />
          <StatCard
            title="Orders"
            value={stats.orders}
          />
          <StatCard
            title="Staff"
            value={stats.staff}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
          />

      
        </div>
      )}

      {/* ================= NAVIGATION ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Products
          </h2>
          <p className="text-gray-600">
            Manage products & stock
          </p>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white p-6 rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Categories
          </h2>
          <p className="text-gray-600">
            Manage product categories
          </p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Orders
          </h2>
          <p className="text-gray-600">
            View & update orders
          </p>
        </Link>

        <Link
          to="/admin/staff"
          className="bg-white p-6 rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Staff
          </h2>
          <p className="text-gray-600">
            Manage staff & roles
          </p>
        </Link>

         <Link
          to="/admin/inventory/logs"
          className="bg-white p-6 rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Inventory
          </h2>
          <p className="text-gray-600">
            Stocks Details 
          </p>
        </Link>

        {/* ⭐ NEW SALES CARD */}
        <Link
          to="/admin/sales"
          className="bg-white p-6 rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Sales & Reports
          </h2>
          <p className="text-gray-600">
            Custom date revenue
          </p>
        </Link>
      </div>
    </div>
  )
}

const StatCard = ({
  title,
  value,
  highlight,
}: {
  title: string
  value: number | string
  highlight?: boolean
}) => (
  <div
    className={`p-4 rounded shadow ${
      highlight
        ? 'bg-black text-white'
        : 'bg-white'
    }`}
  >
    <p
      className={`text-sm ${
        highlight
          ? 'text-gray-300'
          : 'text-gray-500'
      }`}
    >
      {title}
    </p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
)

export default AdminDashboard
