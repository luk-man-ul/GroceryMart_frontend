import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

interface Category {
  id: number
  name: string
}

const AddProduct = () => {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    price: '',
    offerPrice: '',
    stock: '',
    stockType: 'quantity',
    categoryId: '',
    image: '',
  })

  // 🔹 Fetch categories
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      await api.post('/products', {
        name: form.name,
        price: Number(form.price),
        offerPrice: form.offerPrice ? Number(form.offerPrice) : null,
        stock: Number(form.stock),
        stockType: form.stockType,
        categoryId: Number(form.categoryId),
        image: form.image || null,
      })

      navigate('/admin/products')
    } catch (err) {
      console.error('Failed to add product', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-xl space-y-4">
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="offerPrice"
          type="number"
          placeholder="Offer price (optional)"
          value={form.offerPrice}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <select
          name="stockType"
          value={form.stockType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="quantity">Quantity</option>
          <option value="kg">Kg</option>
        </select>

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          name="image"
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? 'Saving...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}

export default AddProduct
