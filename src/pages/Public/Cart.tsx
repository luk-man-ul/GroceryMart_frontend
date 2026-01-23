import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../auth/AuthContext'
import { useCart } from '../../cart/CartContext'
import type { CartItem } from '../../types'

const Cart = () => {
  const { items, refreshCart } = useCart()
  const { token } = useAuth()
  const isAuthenticated = !!token
  const navigate = useNavigate()

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
          onClick={() => navigate('/checkout')}
          className="mt-6 w-full bg-black text-white py-3 rounded-xl text-lg"
        >
          Check Out
        </button>
      ) : (
        <Link
          to="/login"
          className="mt-6 block text-center bg-black text-white py-3 rounded-xl text-lg"
        >
          Login to Place Order
        </Link>
      )}
    </div>
  )
}

export default Cart
