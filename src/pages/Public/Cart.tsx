import { Link, useNavigate } from 'react-router-dom'
import { useCallback, useMemo, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../auth/AuthContext'
import { useCart } from '../../cart/CartContext'
import type { CartItem } from '../../types'

const Cart = () => {
  const { items, refreshCart } = useCart()
  const { token } = useAuth()
  const isAuthenticated = !!token
  const navigate = useNavigate()

  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * ➕➖ Update quantity OR remove item
   */
  const handleDecrease = useCallback(
    async (item: CartItem) => {
      try {
        setLoading(true)

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
        console.error('Failed to decrease quantity', err)
      } finally {
        setLoading(false)
      }
    },
    [refreshCart],
  )

  const handleIncrease = useCallback(
    async (item: CartItem) => {
      try {
        setLoading(true)

        await api.put('/cart/update', {
          productId: item.productId,
          quantity: item.quantity + 1,
        })

        await refreshCart()
      } catch (err) {
        console.error('Failed to increase quantity', err)
      } finally {
        setLoading(false)
      }
    },
    [refreshCart],
  )

  const removeItem = useCallback(
    async (item: CartItem) => {
      try {
        setLoading(true)

        await api.delete('/cart/remove', {
          data: { productId: item.productId },
        })

        await refreshCart()
      } catch (err) {
        console.error('Failed to remove item', err)
      } finally {
        setLoading(false)
      }
    },
    [refreshCart],
  )

  /**
   * 💰 Total price (memoized)
   */
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.quantity * item.product.price,
        0,
      ),
    [items],
  )

  /**
   * 🛒 Place order
   */
  const placeOrder = async () => {
    try {
      setLoading(true)

      await api.post('/orders')

      await refreshCart()
      navigate('/order-success')
    } catch (err: any) {
      console.error('Order failed')

      if (err?.response) {
        alert(
          err.response.data?.message ??
            'Order failed',
        )
      } else {
        alert('Network / server error')
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 💤 Empty cart state
   */
  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold mb-2">
          Your Cart
        </h1>
        <p className="text-gray-600">
          Your cart is empty
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">
        Cart
      </h1>

      {items.map(item => (
        <div
          key={item.id}
          className="border rounded-lg p-3 flex justify-between items-center"
        >
          {/* Product info */}
          <div>
            <p className="font-medium">
              {item.product.name}
            </p>
            <p className="text-gray-600">
              ₹ {item.product.price}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Decrease quantity"
              disabled={loading}
              onClick={() => handleDecrease(item)}
              className="px-2 border rounded disabled:opacity-50"
            >
              −
            </button>

            <span>{item.quantity}</span>

            <button
              aria-label="Increase quantity"
              disabled={loading}
              onClick={() => handleIncrease(item)}
              className="px-2 border rounded disabled:opacity-50"
            >
              +
            </button>

            <button
              aria-label="Remove item"
              disabled={loading}
              onClick={() => removeItem(item)}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
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
          disabled={loading}
          onClick={() => setShowConfirm(true)}
          className="bg-black text-white w-full py-2 rounded disabled:opacity-60"
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

      {/* ================= CONFIRM MODAL ================= */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl w-[90%] max-w-md shadow-xl overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <h2 className="text-white text-lg font-semibold">
                Confirm Order
              </h2>
            </div>

            <div className="px-6 py-5">
              <p className="text-gray-700 mb-4">
                Are you sure you want to place this
                order?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setShowConfirm(false)
                  }
                  className="px-5 py-2 rounded border text-gray-700 hover:bg-gray-100"
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
