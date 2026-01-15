import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0,
    pendingOrders: 0,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        const [productsRes, categoriesRes, ordersRes] =
          await Promise.all([
            api.get('/products'),
            api.get('/categories'),
            api.get('/orders'),
          ])

        const orders = ordersRes.data

        const revenue = orders.reduce(
          (sum: number, o: any) => sum + o.totalPrice,
          0,
        )

        const pending = orders.filter(
          (o: any) =>
            o.status === 'PLACED' || o.status === 'PROCESSING',
        ).length

        setStats({
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
          orders: orders.length,
          revenue,
          pendingOrders: pending,
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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats cards */}
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard title="Products" value={stats.products} />
          <StatCard title="Categories" value={stats.categories} />
          <StatCard title="Orders" value={stats.orders} />
          <StatCard
            title="Revenue"
            value={`₹${stats.revenue}`}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
          />
        </div>
      )}

      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-gray-600">Manage products & stock</p>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white p-6 rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Categories</h2>
          <p className="text-gray-600">Manage product categories</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-gray-600">View & update orders</p>
        </Link>
      </div>
    </div>
  )
}

const StatCard = ({
  title,
  value,
}: {
  title: string
  value: number | string
}) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
)

export default AdminDashboard
