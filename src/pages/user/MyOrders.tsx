import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Link } from 'react-router-dom'

/* ================= TYPES ================= */

type Product = {
  id: number
  name: string
  image?: string | null
}

type OrderItem = {
  id: number
  quantity: number
  price: number
  product: Product
}

type DeliveryStaff = {
  id: number
  name: string
  email: string
}

type Order = {
  id: number
  totalPrice: number
  status: 'PLACED' | 'PROCESSING' | 'DELIVERED'
  createdAt: string
  items: OrderItem[]
  deliveryStaff?: DeliveryStaff | null
}

/* ================= HELPERS ================= */

const statusStyle: Record<Order['status'], string> = {
  PLACED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green-100 text-green-700',
}

/* ================= COMPONENT ================= */

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Order[]>('/orders/my')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
     <div className="min-h-screen flex items-center justify-center text-gray-500">
      Loading orders...
    </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">No orders yet</h2>
        <p className="text-gray-500 mt-1">
          Once you place an order, it will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {/* Orders */}
      <div className="space-y-5">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold">Order ID : ABD-{order.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyle[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            {/* Products */}
            <div className="space-y-3 mb-4">
              {order.items.slice(0, 2).map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3"
                >
                  {/* Image */}
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">
                        No Image
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <p className="text-sm font-medium">
                    ₹ {item.price * item.quantity}
                  </p>
                </div>
              ))}

              {order.items.length > 2 && (
                <p className="text-sm text-gray-500">
                  + {order.items.length - 2} more item(s)
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-600">
                {order.deliveryStaff ? (
                  <>
                    <span className="font-medium">
                      Delivery Staff:
                    </span>{' '}
                    {order.deliveryStaff.name}
                  </>
                ) : (
                  <span className="italic text-gray-400">
                    Delivery staff not assigned yet
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <p className="text-lg font-bold">
                  ₹ {order.totalPrice}
                </p>

                <Link
                  to={`/orders/${order.id}`}
                  className="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
