import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

const EditCategory = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  // Load category data
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const res = await api.get('/categories')
        const category = res.data.find((c: any) => c.id === Number(id))

        if (!category) {
          alert('Category not found')
          navigate('/admin/categories')
          return
        }

        setName(category.name)
        setImage(category.image || '')
      } catch (err) {
        console.error('Failed to load category', err)
      }
    }

    loadCategory()
  }, [id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      await api.put(`/categories/${id}`, {
        name,
        image: image || null,
      })
      navigate('/admin/categories')
    } catch (err) {
      console.error('Update failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Category</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md space-y-4"
      >
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category name"
          required
          className="w-full border p-2 rounded"
        />

        <input
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="Image URL (optional)"
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? 'Saving...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCategory
