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
  user: {
    name: string
    email: string
  }
  items: OrderItem[]
}



const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status/${status}`)
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status } : o,
        ),
      )
    } catch (err) {
      console.error('Status update failed', err)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white p-6 rounded shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.user.name} — {order.user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <select
                  value={order.status}
                  onChange={e =>
                    updateStatus(
                      order.id,
                      e.target.value as OrderStatus,
                    )
                  }
                  className="border p-2 rounded"
                >
                  <option value="PLACED">PLACED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>

              {/* Items */}
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id} className="border-t">
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

              {/* Total */}
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
