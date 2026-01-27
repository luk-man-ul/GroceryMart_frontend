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

const statusStyles: Record<OrderStatus, string> = {
  PLACED: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState<number | null>(null)

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
        res.data.filter(
          (s: Staff) =>
            s.role === 'DELIVERY_STAFF' && s.isActive,
        ),
      )
    } catch (err) {
      console.error('Failed to fetch staff', err)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchStaff()
  }, [])

  const assignDeliveryStaff = async (
    orderId: number,
    staffId: number,
  ) => {
    try {
      setAssigning(orderId)

      await api.patch(
        `/orders/${orderId}/assign-delivery/${staffId}`,
      )

      const assignedStaff = staff.find(
        s => s.id === staffId,
      )

      setOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? {
                ...o,
                status: 'PROCESSING',
                deliveryStaff: assignedStaff
                  ? {
                      id: assignedStaff.id,
                      name: assignedStaff.name,
                      email: '',
                    }
                  : null,
              }
            : o,
        ),
      )
    } catch (err) {
      alert('Failed to assign delivery staff')
    } finally {
      setAssigning(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Orders Management
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">
          Loading orders...
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500 hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 p-6 border-b">
                <div className="space-y-1">
                  <p className="text-lg font-semibold">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.user.name} • {order.user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              {/* CONTACT INFO */}
              <div className="px-6 py-4 grid md:grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="font-medium text-gray-700">
                    Phone:
                  </span>{' '}
                  {order.phone ?? 'Not provided'}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Address:
                  </span>{' '}
                  {order.address ?? 'Not provided'}
                </p>
              </div>

              {/* ASSIGNMENT */}
              <div className="px-6 pb-4">
                {order.status === 'PLACED' &&
                !order.deliveryStaff ? (
                  <select
                    defaultValue=""
                    disabled={assigning === order.id}
                    onChange={e =>
                      assignDeliveryStaff(
                        order.id,
                        Number(e.target.value),
                      )
                    }
                    className="w-full md:w-72 rounded-lg border ring-2 ring-blue-200 text-sm"
                  >
                    <option value="" disabled>
                      Assign delivery staff
                    </option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                ) : order.deliveryStaff ? (
                  <p className="text-sm text-green-700 font-medium">
                    Assigned to {order.deliveryStaff.name}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Assignment locked
                  </p>
                )}
              </div>

              {/* ITEMS TABLE */}
              <div className="px-6 pb-6">
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="p-3 text-left">
                          Product
                        </th>
                        <th className="p-3 text-left">
                          Qty
                        </th>
                        <th className="p-3 text-left">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map(item => (
                        <tr
                          key={item.id}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="p-3">
                            {item.product.name}
                          </td>
                          <td className="p-3">
                            {item.quantity}
                          </td>
                          <td className="p-3">
                            ₹{item.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-right mt-4 text-lg font-semibold">
                  Total: ₹{order.totalPrice}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-center text-gray-500">
              No orders found
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminOrders