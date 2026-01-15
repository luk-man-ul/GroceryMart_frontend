import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

interface Category {
  id: number
  name: string
  image?: string | null
  trash: boolean
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [showTrash, setShowTrash] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await api.get('/categories', {
        params: { trash: showTrash },
      })
      setCategories(res.data)
    } catch (err) {
      console.error('Failed to fetch categories', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [showTrash])

  const deleteCategory = async (id: number) => {
    if (!window.confirm('Delete this category?')) return
    await api.delete(`/categories/${id}`)
    fetchCategories()
  }

  const restoreCategory = async (id: number) => {
    await api.post(`/categories/${id}/restore`)
    fetchCategories()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Category Management</h1>

        {/* ✅ RELATIVE LINK — THIS FIXES THE ISSUE */}
        <Link
          to="add"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Category
        </Link>
      </div>

      {/* Toggle */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowTrash(false)}
          className={`px-4 py-2 rounded ${
            !showTrash ? 'bg-black text-white' : 'border'
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setShowTrash(true)}
          className={`px-4 py-2 rounded ${
            showTrash ? 'bg-black text-white' : 'border'
          }`}
        >
          Deleted
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>

                <td className="p-3">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-12 h-12 object-cover"
                    />
                  ) : (
                    '—'
                  )}
                </td>

                <td className="p-3 space-x-3">
                  {!showTrash ? (
                    <>
                      {/* ✅ RELATIVE EDIT LINK */}
                      <Link
                        to={`edit/${c.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => restoreCategory(c.id)}
                      className="text-green-600 hover:underline"
                    >
                      Restore
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-gray-500"
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminCategories
