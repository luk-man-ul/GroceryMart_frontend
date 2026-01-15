import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../auth/AuthContext'
import { useCart } from '../../cart/CartContext'
import type { CartItem } from '../../types'
import { useState } from 'react'

const Cart = () => {
  const { items, refreshCart } = useCart()
  const { token } = useAuth()
  const isAuthenticated = !!token
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)


  // ➕➖ Update quantity OR remove if quantity becomes 1
  const handleDecrease = async (item: CartItem) => {
    try {
      if (item.quantity === 1) {
        // remove item
        await api.delete('/cart/remove', {
          data: { productId: item.productId },
        })
      } else {
        // decrease quantity
        await api.put('/cart/update', {
          productId: item.productId,
          quantity: item.quantity - 1,
        })
      }

      await refreshCart()
    } catch (err) {
      console.error('Failed to decrease quantity', err)
    }
  }

  const handleIncrease = async (item: CartItem) => {
    try {
      await api.put('/cart/update', {
        productId: item.productId,
        quantity: item.quantity + 1,
      })

      await refreshCart()
    } catch (err) {
      console.error('Failed to increase quantity', err)
    }
  }

  const removeItem = async (item: CartItem) => {
    try {
      await api.delete('/cart/remove', {
        data: { productId: item.productId },
      })

      await refreshCart()
    } catch (err) {
      console.error('Failed to remove item', err)
    }
  }

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  )

  const placeOrder = async () => {
  try {
    const res = await api.post('/orders')
    console.log('Order response:', res.data)

    // optional but good
    await refreshCart()

    navigate('/order-success')
  } catch (err: any) {
    console.error('Order failed')

    if (err.response) {
      console.error('Status:', err.response.status)
      console.error('Message:', err.response.data)
      alert(err.response.data.message ?? 'Order failed')
    } else {
      console.error(err)
      alert('Network / server error')
    }
  }
}


  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold mb-2">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Cart</h1>

      {items.map(item => (
        <div
          key={item.id} // 🔥 CRITICAL: unique cart item id
          className="border p-3 flex justify-between items-center"
        >
          {/* Product info */}
          <div>
            <p className="font-medium">{item.product.name}</p>
            <p className="text-gray-600">₹ {item.product.price}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecrease(item)}
              className="px-2 border"
            >
              −
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => handleIncrease(item)}
              className="px-2 border"
            >
              +
            </button>

            <button
              onClick={() => removeItem(item)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center font-bold">
        <span>Total</span>
        <span>₹ {total}</span>
      </div>

      {isAuthenticated ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-black text-white w-full py-2 rounded"
        >
          Place Order
        </button>

      ) : (
        <Link
          to="/login"
          className="bg-black text-white w-full py-2 rounded text-center block"
        >
          Login to Place Order
        </Link>
      )}
     {showConfirm && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-[90%] max-w-md shadow-xl overflow-hidden">
      
      {/* Green header */}
      <div className="bg-green-600 px-6 py-4">
        <h2 className="text-white text-lg font-semibold">
          Confirm Order
        </h2>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <p className="text-gray-700 mb-4">
          Are you sure you want to place this order?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowConfirm(false)}
            className="px-5 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              setShowConfirm(false)
              await placeOrder()
            }}
            className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Confirm Order
          </button>
        </div>
      </div>

    </div>
  </div>
)}

    </div>
  )
}

export default Cart
