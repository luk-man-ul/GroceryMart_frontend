import { useEffect, useState } from 'react'
import api from '../../api/axios'
import type {
  DeliveryOrder,
  DeliveryStatus,
} from '../../types'

const Delivery = () => {
  const [orders, setOrders] =
    useState<DeliveryOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(
          '/orders/delivery/my',
        )

        const formatted: DeliveryOrder[] =
          res.data.map((order: any) => ({
            id: order.id,
            customerName: order.user.name,
            address: 'Address not available',
            totalAmount: order.totalPrice,
            status: order.status,
          }))

        setOrders(formatted)
      } catch (err) {
        console.error(err)
        setError('Failed to load delivery orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const updateStatus = async (
    orderId: number,
    status: DeliveryStatus,
  ) => {
    try {
      await api.patch(
        `/orders/delivery/${orderId}/status`,
        { status },
      )

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status }
            : order,
        ),
      )
    } catch (err) {
      console.error(err)
      alert('Failed to update status')
    }
  }

  if (loading) return <p>Loading...</p>
  if (error)
    return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Delivery Tasks
      </h1>

      {orders.length === 0 ? (
        <p>No assigned deliveries.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white p-4 rounded shadow"
            >
              <p className="font-semibold">
                Order #{order.id}
              </p>
              <p>{order.customerName}</p>
              <p>₹{order.totalAmount}</p>
              <p>Status: {order.status}</p>

              {order.status !== 'DELIVERED' && (
                <div className="mt-3">
                  {order.status === 'PLACED' && (
                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          'PROCESSING',
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Start Delivery
                    </button>
                  )}

                  {order.status === 'PROCESSING' && (
                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          'DELIVERED',
                        )
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Delivery
