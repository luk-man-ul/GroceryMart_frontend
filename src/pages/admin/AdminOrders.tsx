import { useEffect, useState } from 'react'
import api from '../../api/axios'

type OrderStatus = 'PLACED' | 'PROCESSING' | 'DELIVERED'

interface OrderItem {
  id: number
  quantity: number
  price: number
  product: {
    name: string
  }
}

interface Order {
  id: number
  totalPrice: number
  status: OrderStatus
  createdAt: string
  phone?: string | null
  address?: string | null
  user: {
    name: string
    email: string
  }
  deliveryStaff?: {
    id: number
    name: string
    email: string
  } | null
  items: OrderItem[]
}

interface Staff {
  id: number
  name: string
  role: 'DELIVERY_STAFF' | 'SHOP_STAFF' | 'INVENTORY_STAFF'
  isActive: boolean
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')

  // 🔹 WhatsApp helper: shop owner → customer (send on click)
const buildCustomerWhatsAppLink = (order: Order) => {
  if (!order.phone) return '#'

  const itemsText = order.items
    .map(
      item =>
        `- ${item.product.name} x${item.quantity} = ₹${item.price * item.quantity}`,
    )
    .join('\n')

  const message = `
Hello ${order.user.name},

Your order #${order.id} has been placed successfully.

Items:
${itemsText}

Total Amount: ₹${order.totalPrice}

Delivery Address:
${order.address ?? 'N/A'}

Thank you for shopping with us.
`

  return `https://wa.me/${order.phone}?text=${encodeURIComponent(message)}`
}


  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Get statistics
  const stats = {
    total: orders.length,
    placed: orders.filter(o => o.status === 'PLACED').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0)
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStaff = async () => {
    try {
      const res = await api.get('/admin/staff')
      setStaff(
        res.data.filter((s: Staff) => s.role === 'DELIVERY_STAFF' && s.isActive)
      )
    } catch (err) {
      console.error('Failed to fetch staff', err)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchStaff()
  }, [])

  const assignDeliveryStaff = async (orderId: number, staffId: number) => {
    try {
      setAssigning(orderId)
      await api.patch(`/orders/${orderId}/assign-delivery/${staffId}`)
      
      const assignedStaff = staff.find(s => s.id === staffId)
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? {
                ...o,
                status: 'PROCESSING' as OrderStatus,
                deliveryStaff: assignedStaff
                  ? {
                      id: assignedStaff.id,
                      name: assignedStaff.name,
                      email: '',
                    }
                  : null,
              }
            : o
        )
      )
    } catch (err) {
      alert('Failed to assign delivery staff')
    } finally {
      setAssigning(null)
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'PROCESSING':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'DELIVERED':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Orders Management</h1>
          <p className="text-gray-600">Track and manage customer orders efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-xl">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Placed</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.placed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Revenue</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  statusFilter === 'all'
                    ? 'bg-gray-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setStatusFilter('PLACED')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  statusFilter === 'PLACED'
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                Placed
              </button>
              <button
                onClick={() => setStatusFilter('PROCESSING')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  statusFilter === 'PROCESSING'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setStatusFilter('DELIVERED')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  statusFilter === 'DELIVERED'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Delivered
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg className="mx-auto w-20 h-20 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your search or filter."
                : "No orders have been placed yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Order #{order.id}</h3>
                      <div className="flex items-center gap-4 text-indigo-100">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{order.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{order.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                          </svg>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                   <div className="flex items-center gap-4">
  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
    {getStatusIcon(order.status)}
    <span className="font-semibold">{order.status}</span>
  </div>

  <div className="text-right">
    <p className="text-indigo-100 text-sm">Total Amount</p>
    <p className="text-2xl font-bold">
      ₹{order.totalPrice.toLocaleString()}
    </p>
  </div>

  {order.phone && (
    <button
      onClick={() =>
        window.open(buildCustomerWhatsAppLink(order), '_blank')
      }
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
    >
      Reply on WhatsApp
    </button>
  )}
</div>

                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-semibold text-gray-900">Phone Number</span>
                      </div>
                      <p className="text-gray-700">{order.phone || 'Not provided'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold text-gray-900">Delivery Address</span>
                      </div>
                      <p className="text-gray-700">{order.address || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Delivery Staff Assignment */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-semibold text-blue-900">Delivery Assignment</span>
                    </div>
                    
                    {order.status === 'PLACED' && !order.deliveryStaff ? (
                      <select
                        defaultValue=""
                        disabled={assigning === order.id}
                        onChange={e => assignDeliveryStaff(order.id, Number(e.target.value))}
                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="" disabled>
                          {assigning === order.id ? 'Assigning...' : 'Select delivery staff'}
                        </option>
                        {staff.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    ) : order.deliveryStaff ? (
                      <div className="flex items-center gap-2 text-green-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">Assigned to {order.deliveryStaff.name}</span>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Assignment not available for this status</p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900">Order Items</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Unit Price</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-sm font-bold text-indigo-600">
                                      {item.product.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="font-medium text-gray-900">{item.product.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-gray-900">₹{item.price}</td>
                              <td className="px-4 py-3 font-bold text-gray-900">₹{(item.quantity * item.price).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {!loading && filteredOrders.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders