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

const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    house: '',
    street: '',
    city: '',
    pincode: '',
  })

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses')
      setAddresses(res.data)
    } catch {
      setError('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const addAddress = async () => {
    try {
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
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error')
    }
  }

  const setDefault = async (id: number) => {
    await api.patch(`/addresses/${id}`, {
      isDefault: true,
    })
    fetchAddresses()
  }

  const removeAddress = async (id: number) => {
    try {
      await api.delete(`/addresses/${id}`)
      fetchAddresses()
    } catch (err: any) {
      alert(err.response?.data?.message)
    }
  }

  if (loading) return <p>Loading addresses…</p>

  return (
    <div className="max-w-4xl mx-auto py-1 px-4 space-y-6">
       <button
    onClick={() => navigate('/account')}
    className="text-sm text-gray-600 hover:text-black flex items-center gap-2"
  >
    ← Back to Account
  </button>

      {/* LIST */}
      <div className="space-y-4">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className="border rounded-xl p-4 flex justify-between"
          >
            <div>
              <p className="font-semibold">
                {addr.name}{' '}
                {addr.isDefault && (
                  <span className="text-xs text-green-600">
                    (Default)
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600">
                {addr.house}, {addr.street},{' '}
                {addr.city} - {addr.pincode}
              </p>
              <p className="text-sm">
                Phone: {addr.phone}
              </p>
            </div>

            <div className="flex gap-3 items-start">
              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr.id)}
                  className="text-blue-600 text-sm"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => removeAddress(addr.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full border border-dashed bg-orange-300 py-3 rounded-lg text-gray-700 hover:bg-orange-400"
      >
        + Add New Address
      </button>

      {error && (
        <p className="text-red-600 text-sm">
          {error}
        </p>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center mt-25 z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg text-center font-semibold">
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
                onClick={addAddress}
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

export default AddressBook
