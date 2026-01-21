import { useEffect, useState } from 'react'
import api from '../../api/axios'

const ROLES = [
  { value: 'SHOP_STAFF', label: 'Shop Staff' },
  { value: 'DELIVERY_STAFF', label: 'Delivery Staff' },
  { value: 'INVENTORY_STAFF', label: 'Inventory Staff' },
]

type Staff = {
  id: number
  name: string
  email: string
  role: string
  isActive: boolean
}

const AdminStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SHOP_STAFF',
  })

  // =========================
  // LOAD STAFF
  // =========================
  const fetchStaff = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/staff')
      setStaff(res.data)
    } catch (err) {
      console.error('Failed to load staff', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  // =========================
  // ADD STAFF
  // =========================
  const addStaff = async () => {
    try {
      const res = await api.post('/admin/staff', form)

      setStaff((prev) => [...prev, res.data])

      setShowModal(false)
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'SHOP_STAFF',
      })
    } catch (err) {
      console.error('Failed to add staff', err)
    }
  }

  // =========================
  // UPDATE ROLE (OPTIMISTIC)
  // =========================
  const updateRole = async (id: number, role: string) => {
    try {
      await api.patch(`/admin/staff/${id}/role`, { role })

      setStaff((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, role } : s,
        ),
      )
    } catch (err) {
      console.error('Failed to update role', err)
    }
  }

  // =========================
  // UPDATE STATUS (OPTIMISTIC)
  // =========================
  const updateStatus = async (id: number, isActive: boolean) => {
    try {
      await api.patch(`/admin/staff/${id}/status`, { isActive })

      setStaff((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, isActive } : s,
        ),
      )
    } catch (err) {
      console.error('Failed to update staff status', err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Staff
        </button>
      </div>

      {loading ? (
        <p>Loading staff...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>

                  {/* ROLE */}
                  <td className="p-3">
                    <select
                      value={s.role}
                      onChange={(e) =>
                        updateRole(s.id, e.target.value)
                      }
                      disabled={!s.isActive}
                      className={`border rounded px-2 py-1 text-sm w-40 ${
                        !s.isActive
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white'
                      }`}
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    {s.isActive ? (
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Disabled
                      </span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    {s.isActive ? (
                      <button
                        onClick={() =>
                          updateStatus(s.id, false)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          updateStatus(s.id, true)
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Enable
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              Add Staff
            </h2>

            <input
              placeholder="Name"
              className="w-full border p-2 mb-3 rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="w-full border p-2 mb-3 rounded"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 mb-3 rounded"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <select
              className="w-full border p-2 mb-4 rounded"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={addStaff}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminStaff
