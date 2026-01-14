import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Link } from 'react-router-dom'

type Order = {
  id: number
  totalPrice: number
  status: string
  createdAt: string
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Order[]>('/orders/my')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-4">Loading orders...</p>

  if (orders.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold">No orders yet</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
       <div className="flex justify-end mb-2">
          <Link
            to="/order-success"
            className="text-green-700 text-sm hover:underline"
          >
            View Latest
          </Link>
        </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="border rounded-lg p-4 bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Order #{order.id}</p>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm">
                Status: <strong>{order.status}</strong>
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold">₹ {order.totalPrice}</p>
            </div>
          </div>
          
        ))}
      </div>
    </div>
  )
}

export default MyOrders
