import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const AddCategory = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Category name is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await api.post('/categories', {
        name,
        image: image.trim() ? image : null,
      })

      // go back to categories list
      navigate('/admin/categories')
    } catch (err) {
      console.error('Failed to add category', err)
      setError('Failed to add category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Add Category</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md space-y-4"
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Eg: Fruits"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL (optional)</label>
          <input
            type="text"
            value={image}
            onChange={e => setImage(e.target.value)}
            placeholder="https://example.com/image.png"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? 'Saving...' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCategory
