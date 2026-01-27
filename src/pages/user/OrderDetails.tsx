import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'

/* ================= TYPES ================= */

type OrderItem = {
  quantity: number
  price: number
  product: {
    name: string
    image?: string | null
  }
}

type DeliveryStaff = {
  name: string
  email: string
}

type Order = {
  id: number
  totalPrice: number
  status: 'PLACED' | 'PROCESSING' | 'DELIVERED'
  createdAt: string
  phone?: string | null
  address?: string | null
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

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Order>(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .finally(() => setLoading(false))
  }, [id])

 if (loading) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center text-gray-500">
      Loading order details...
    </div>
  )
}


  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-semibold mb-2">
          Order not found
        </p>
        <Link
          to="/Orders"
          className="text-blue-600 hover:underline"
        >
          Back to My Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">
          Order #{order.id}
        </h1>

        <span
          className={`px-4 py-1 text-sm font-medium rounded-full w-fit ${statusStyle[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      {/* ORDER META */}
      <div className="bg-white border rounded-xl p-5 shadow-sm grid gap-3 sm:grid-cols-2">
        <p>
          <span className="font-medium">Date:</span>{' '}
          {new Date(order.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Phone:</span>{' '}
          {order.phone ?? 'Not provided'}
        </p>
        <p className="sm:col-span-2">
          <span className="font-medium">Address:</span>{' '}
          {order.address ?? 'Not provided'}
        </p>

        {order.deliveryStaff && (
          <p className="sm:col-span-2 text-green-700">
            <span className="font-medium">
              Delivery Staff:
            </span>{' '}
            {order.deliveryStaff.name}
          </p>
        )}
      </div>

      {/* ITEMS */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Order Items
        </h2>

        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 border-b pb-4 last:border-b-0"
            >
              {/* IMAGE */}
              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
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

              {/* INFO */}
              <div className="flex-1">
                <p className="font-medium">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              {/* PRICE */}
              <p className="font-medium">
                ₹ {item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="flex justify-between items-center bg-gray-50 border rounded-xl p-5">
        <Link
          to="/Orders"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to My Orders
        </Link>

        <p className="text-xl font-bold">
          Total: ₹ {order.totalPrice}
        </p>
      </div>
    </div>
  )
}

export default OrderDetails
