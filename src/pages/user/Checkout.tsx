import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useCart } from '../../cart/CartContext'

type PaymentMethod = 'COD' | 'ONLINE'

type Address = {
  id: number
  name: string
  phone: string
  house: string
  street: string
  city: string
  pincode: string
}

const Checkout = () => {
  const { items, refreshCart } = useCart()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('COD')

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [addressId, setAddressId] =
    useState<number | null>(null)
  const [address, setAddress] =
    useState<Address | null>(null)

  // 🔹 Load selected address & validate
  useEffect(() => {
    const storedId =
      localStorage.getItem('selectedAddressId')

    if (!storedId) {
      navigate('/delivery-location')
      return
    }

    const id = Number(storedId)
    setAddressId(id)

    api
      .get('/addresses')
      .then(res => {
        const found = res.data.find(
          (a: Address) => a.id === id,
        )

        if (!found) {
          localStorage.removeItem(
            'selectedAddressId',
          )
          navigate('/delivery-location')
          return
        }

        setAddress(found)
      })
      .catch(() => {
        navigate('/delivery-location')
      })
  }, [navigate])

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          item.quantity * item.product.price,
        0,
      ),
    [items],
  )

  const placeOrder = async () => {
    if (!addressId || !address || submitting)
      return

    setError('')

    if (paymentMethod === 'ONLINE') {
      setError('Online payment will be available soon')
      return
    }

    try {
      setSubmitting(true)

      await api.post('/orders', {
        addressId,
        paymentMethod,
      })

      localStorage.removeItem('selectedAddressId')
      await refreshCart()
      navigate('/order-success')
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to place order',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">
          Checkout
        </h1>
        <p className="text-gray-500">
          Your cart is empty
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
      {/* LEFT */}
      <div className="space-y-5">
        {/* DELIVERY ADDRESS SUMMARY */}
        {address && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold mb-1">
                  Delivery Address
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>{address.name}</strong>
                  <br />
                  {address.house},{' '}
                  {address.street}
                  <br />
                  {address.city} -{' '}
                  {address.pincode}
                  <br />
                  Phone: {address.phone}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate('/delivery-location')
                }
                className="text-sm text-blue-600"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-3">
            Payment Method
          </h2>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              checked={paymentMethod === 'COD'}
              onChange={() =>
                setPaymentMethod('COD')
              }
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-3 text-gray-400 mt-2">
            <input type="radio" disabled />
            Online Payment (Coming Soon)
          </label>

          {error && (
            <p className="text-sm text-red-600 mt-3">
              {error}
            </p>
          )}

          <button
            onClick={placeOrder}
            disabled={
              submitting || !addressId || !address
            }
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {submitting
              ? 'Placing Order…'
              : 'Confirm Order (COD)'}
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
        <h2 className="text-lg font-semibold mb-4">
          Order Summary
        </h2>

        {items.map(item => (
          <div
            key={item.id}
            className="flex justify-between text-sm mb-2"
          >
            <span>
              {item.product.name} ×{' '}
              {item.quantity}
            </span>
            <span>
              ₹{' '}
              {item.quantity *
                item.product.price}
            </span>
          </div>
        ))}

        <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>
      </div>
    </div>
  )
}

export default Checkout
