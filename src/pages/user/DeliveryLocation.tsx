import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

type Address = {
  id: number
  name: string
  phone: string
  house: string
  street: string
  city: string
  pincode: string
  isDefault: boolean
}

const DeliveryLocation = () => {
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // modal state
  const [showModal, setShowModal] = useState(false)

  // new address form
  const [form, setForm] = useState({
    name: '',
    phone: '',
    house: '',
    street: '',
    city: '',
    pincode: '',
  })

  const fetchAddresses = async () => {
    const res = await api.get('/addresses')
    setAddresses(res.data)

    const defaultAddr = res.data.find((a: Address) => a.isDefault)
    if (defaultAddr) {
      setSelectedId(defaultAddr.id)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const createAddress = async () => {
    await api.post('/addresses', {
      ...form,
      isDefault: addresses.length === 0,
    })

    setForm({
      name: '',
      phone: '',
      house: '',
      street: '',
      city: '',
      pincode: '',
    })

    setShowModal(false)
    fetchAddresses()
  }

  const continueToCheckout = () => {
    if (!selectedId) {
      alert('Select a delivery address')
      return
    }

    localStorage.setItem(
      'selectedAddressId',
      String(selectedId),
    )
    navigate('/checkout')
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-xl font-semibold">
        Delivery Location
      </h1>

      {/* SAVED ADDRESSES */}
      <div className="space-y-3">
        {addresses.map(addr => (
          <label
            key={addr.id}
            className={`block border p-4 rounded cursor-pointer ${
              selectedId === addr.id
                ? 'border-green-600 bg-green-50'
                : ''
            }`}
          >
            <input
              type="radio"
              checked={selectedId === addr.id}
              onChange={() => setSelectedId(addr.id)}
              className="mr-2"
            />
            <strong>{addr.name}</strong>
            <div className="text-sm text-gray-600">
              {addr.house}, {addr.street}, {addr.city} -{' '}
              {addr.pincode}
            </div>
            {addr.isDefault && (
              <span className="text-xs text-green-600">
                Default
              </span>
            )}
          </label>
        ))}
      </div>

      {/* ADD NEW ADDRESS BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full border border-dashed bg-orange-200 py-3 rounded-lg text-gray-700 hover:bg-orange-400"
      >
        + Add New Address
      </button>

      {/* CONTINUE */}
      <button
        onClick={continueToCheckout}
        className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-600"
      >
        Continue to Checkout
      </button>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              Add New Address
            </h2>

            {Object.keys(form).map(key => (
              <input
                key={key}
                placeholder={key}
                value={(form as any)[key]}
                onChange={e =>
                  setForm({
                    ...form,
                    [key]: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            ))}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={createAddress}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryLocation
