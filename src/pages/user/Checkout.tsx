import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useCart } from '../../cart/CartContext'

type PaymentMethod = 'COD' | 'ONLINE'

const Checkout = () => {
  const { items, refreshCart } = useCart()
  const navigate = useNavigate()

  // Contact
  const [phone, setPhone] = useState('')

  // Address
  const [name, setName] = useState('')
  const [house, setHouse] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')

  // Payment
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('COD')

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0,
      ),
    [items],
  )

  const isFormValid =
    phone.length === 10 &&
    name.trim().length >= 2 &&
    house.trim().length >= 2 &&
    street.trim().length >= 3 &&
    city.trim().length >= 2 &&
    pincode.length === 6

  const placeOrder = async () => {
    if (!isFormValid || submitting) return

    setError('')

    // FRONTEND ONLY: block online payment
    if (paymentMethod === 'ONLINE') {
      setError('Online payment will be available soon')
      return
    }

    const formattedAddress = `${name}, ${house}, ${street}, ${city} - ${pincode}`

    try {
      setSubmitting(true)

      await api.post('/orders', {
        phone,
        address: formattedAddress,
        paymentMethod, // safe to send (backend can ignore for now)
      })

      await refreshCart()
      navigate('/order-success')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
      {/* LEFT */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold">Delivery Details</h2>

        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          maxLength={10}
          onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="House / Flat"
          value={house}
          onChange={e => setHouse(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Street / Area"
          value={street}
          onChange={e => setStreet(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            maxLength={6}
            onChange={e =>
              setPincode(e.target.value.replace(/\D/g, ''))
            }
            className="border p-2 rounded"
          />
        </div>

        {/* PAYMENT METHOD */}
        <div>
          <h3 className="font-semibold mb-2">Payment Method</h3>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
              <span>Cash on Delivery</span>
            </label>

            <label className="flex items-center gap-3 text-gray-400 cursor-not-allowed">
              <input
                type="radio"
                name="payment"
                disabled
                checked={paymentMethod === 'ONLINE'}
              />
              <span>Online Payment (Coming Soon)</span>
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={placeOrder}
          disabled={!isFormValid || submitting}
          className="w-full bg-green-600 text-white py-3 rounded-xl text-lg disabled:opacity-50"
        >
          {submitting
            ? 'Placing Order…'
            : paymentMethod === 'COD'
            ? 'Confirm Order (COD)'
            : 'Pay Now'}
        </button>
      </div>

      {/* RIGHT */}
      <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="space-y-2 text-sm">
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>
                ₹ {item.quantity * item.product.price}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>
      </div>
    </div>
  )
}

export default Checkout
