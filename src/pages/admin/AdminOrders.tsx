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
  deliveryStaff?: {
    id: number
    name: string
  } | null
  items: OrderItem[]
}

interface Staff {
  id: number
  name: string
  role: 'DELIVERY_STAFF'
  isActive: boolean
}

const statusConfig = {
  PLACED: {
    label: 'Order Placed',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-500',
  },
  PROCESSING: {
    label: 'Delivering',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-500',
  },
  DELIVERED: {
    label: 'Completed',
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-500',
  },
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [assigning, setAssigning] = useState<number | null>(null)

  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data))
    api.get('/admin/staff').then(res =>
      setStaff(
        res.data.filter(
          (s: Staff) => s.role === 'DELIVERY_STAFF' && s.isActive,
        ),
      ),
    )
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

      const staffMember = staff.find(s => s.id === staffId)

      setOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? {
                ...o,
                status: 'PROCESSING',
                deliveryStaff: staffMember
                  ? { id: staffMember.id, name: staffMember.name }
                  : null,
              }
            : o,
        ),
      )
    } finally {
      setAssigning(null)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map(order => {
          const status = statusConfig[order.status]

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col transition-all duration-300 ease-in-out
               hover:shadow-xl hover:-translate-y-1 hover:border-blue-400"
            >
              {/* HEADER */}
              <div className="text-left mb-4">
                <h2 className="text-lg font-semibold">
                  Order #{order.id}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* CUSTOMER */}
              <div className="text-sm text-gray-600 mb-3">
                <p className="font-medium">{order.user.name}</p>
                <p>{order.user.email}</p>
              </div>

              <hr className="my-3" />

              {/* ITEMS */}
              <div className="flex-1 space-y-3">
                <p className="font-semibold text-gray-700">
                  Order Menu
                </p>

                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-3" />

              {/* TOTAL */}
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{order.totalPrice}</span>
              </div>

              {/* DELIVERY STAFF */}
              <div className="mt-4">
                {order.status === 'PLACED' ? (
                  <select
                    defaultValue=""
                    disabled={assigning === order.id}
                    onChange={e =>
                      assignDeliveryStaff(
                        order.id,
                        Number(e.target.value),
                      )
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
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
                  <p className="text-sm text-green-600 font-medium">
                    Assigned to {order.deliveryStaff.name}
                  </p>
                ) : null}
              </div>

              {/* STATUS BUTTON */}
              <div
                className={`mt-5 text-center py-3 rounded-xl border
    transition-all duration-300 cursor-pointer
    ${status.bg} ${status.text} ${status.border}`}
              >
                {status.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminOrders
