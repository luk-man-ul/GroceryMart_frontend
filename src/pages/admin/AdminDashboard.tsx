import { useEffect, useState } from 'react'
import api from '../../api/axios'

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([])

  const fetchOrders = () => {
    api.get('/orders').then(res => setOrders(res.data))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (id: number, status: string) => {
    await api.patch(`/orders/${id}/status/${status}`)
    fetchOrders()
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Admin Orders</h1>

      {orders.map(order => (
        <div key={order.id} className="border p-3 space-y-2">
          <p>Order #{order.id}</p>
          <p>Status: {order.status}</p>

          <div className="flex gap-2">
            <button onClick={() => updateStatus(order.id, 'CONFIRMED')}>
              Confirm
            </button>
            <button onClick={() => updateStatus(order.id, 'DELIVERED')}>
              Deliver
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard
