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
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleDecrease = async (item: CartItem) => {
    try {
      if (item.quantity === 1) {
        await api.delete('/cart/remove', {
          data: { productId: item.productId },
        })
      } else {
        await api.put('/cart/update', {
          productId: item.productId,
          quantity: item.quantity - 1,
        })
      }
      await refreshCart()
    } catch (err) {
      console.error(err)
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
      console.error(err)
    }
  }

  const removeItem = async (item: CartItem) => {
    try {
      await api.delete('/cart/remove', {
        data: { productId: item.productId },
      })
      await refreshCart()
    } catch (err) {
      console.error(err)
    }
  }

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  )

  const placeOrder = async () => {
    if (submitting) return

    setError('')

    if (phone.trim().length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    if (address.trim().length < 10) {
      setError('Please enter a valid delivery address')
      return
    }

    try {
      setSubmitting(true)

      await api.post('/orders', {
        phone,
        address,
      })

      await refreshCart()
      setShowConfirm(false)
      navigate('/order-success')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Order failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Your Cart</h1>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
              />
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-gray-500">
                  ₹ {item.product.price}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => handleDecrease(item)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  −
                </button>

                <span className="px-4 text-sm font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleIncrease(item)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item)}
                className="text-red-500 hover:text-red-700 text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="flex justify-between items-center mt-8 text-lg font-semibold">
        <span>Total</span>
        <span>₹ {total}</span>
      </div>

      {/* ACTION */}
      {isAuthenticated ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="mt-6 w-full bg-black text-white py-3 rounded-xl text-lg"
        >
          Place Order
        </button>
      ) : (
        <Link
          to="/login"
          className="mt-6 block text-center bg-black text-white py-3 rounded-xl text-lg"
        >
          Login to Place Order
        </Link>
      )}

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 say bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-md shadow-xl overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <h2 className="text-white text-lg font-semibold">
                Delivery Details
              </h2>
            </div>

            <div className="px-6 py-5 space-y-4">
              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <textarea
                placeholder="Delivery address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border p-2 rounded"
                rows={3}
              />

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 rounded border"
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="px-5 py-2 rounded bg-green-600 text-white disabled:opacity-60"
                >
                  {submitting ? 'Placing…' : 'Confirm Order'}
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
