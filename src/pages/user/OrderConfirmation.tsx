import { useEffect, useState } from 'react'
import api from '../../api/axios'

type OrderItem = {
  quantity: number
  price: number
  product: {
    name: string
    image?: string
  }
}

type Order = {
  id: number
  totalPrice: number
  status: string
  createdAt: string
  items: OrderItem[]
}

const OrderConfirmation = () => {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Order[]>('/orders/my')
      .then(res => {
        // latest order = first item (sorted desc in backend)
        setOrder(res.data[0])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-4">Loading order...</p>

  if (!order) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold">No orders found</h2>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        Order Confirmed 🎉
      </h1>

      <div className="border rounded-lg p-4 mb-6 bg-white">
        <p><strong>Order ID:</strong> #{order.id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p>
          <strong>Date:</strong>{' '}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

      <div className="space-y-4">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p>₹ {item.price}</p>
              <p className="text-sm text-gray-600">
                Subtotal: ₹ {item.price * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right text-lg font-bold">
        Total Amount: ₹ {order.totalPrice}
      </div>
    </div>
  )
}

export default OrderConfirmation
