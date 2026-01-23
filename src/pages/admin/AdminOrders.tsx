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

  // =========================
  // FETCH ORDERS
  // =========================
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

  // =========================
  // FETCH DELIVERY STAFF
  // =========================
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

  // =========================
  // ASSIGN DELIVERY STAFF
  // =========================
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
      console.error('Assignment failed', err)
      alert('Failed to assign delivery staff')
    } finally {
      setAssigning(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Orders
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white p-6 rounded shadow"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-base">
                    Order #{order.id}
                  </p>

                  <p className="text-gray-600">
                    {order.user.name} — {order.user.email}
                  </p>

                  <p className="text-gray-500">
                    {new Date(
                      order.createdAt,
                    ).toLocaleString()}
                  </p>

                  <div className="pt-2">
                    <p>
                      <strong>Phone:</strong>{' '}
                      {order.phone ?? 'Not provided'}
                    </p>

                    <p>
                      <strong>Address:</strong>{' '}
                      {order.address ?? 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <div className="text-sm font-medium px-3 py-1 rounded bg-gray-100">
                  Status: {order.status}
                </div>
              </div>

              {/* DELIVERY ASSIGNMENT */}
              {order.status === 'PLACED' &&
              !order.deliveryStaff ? (
                <div className="mb-3">
                  <select
                    defaultValue=""
                    disabled={assigning === order.id}
                    onChange={e =>
                      assignDeliveryStaff(
                        order.id,
                        Number(e.target.value),
                      )
                    }
                    className="border p-2 rounded text-sm"
                  >
                    <option value="" disabled>
                      Assign delivery staff
                    </option>

                    {staff.map(s => (
                      <option
                        key={s.id}
                        value={s.id}
                      >
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : order.deliveryStaff ? (
                <p className="text-sm text-green-700 mb-3">
                  Assigned to:{' '}
                  <span className="font-medium">
                    {order.deliveryStaff.name}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 mb-3">
                  Assignment locked
                </p>
              )}

              {/* ITEMS */}
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">
                      Product
                    </th>
                    <th className="p-2 text-left">
                      Qty
                    </th>
                    <th className="p-2 text-left">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr
                      key={item.id}
                      className="border-t"
                    >
                      <td className="p-2">
                        {item.product.name}
                      </td>
                      <td className="p-2">
                        {item.quantity}
                      </td>
                      <td className="p-2">
                        ₹{item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right font-semibold mt-4">
                Total: ₹{order.totalPrice}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-gray-500">
              No orders found
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminOrders