import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

interface Category {
  id: number
  name: string
}

const EditProduct = () => {
  const { id } = useParams()
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

  // Load categories + product
  useEffect(() => {
    const loadData = async () => {
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories'),
        api.get(`/products/${id}`),
      ])

      setCategories(catRes.data)

      const p = prodRes.data
      setForm({
        name: p.name,
        price: p.price,
        offerPrice: p.offerPrice || '',
        stock: p.stock,
        stockType: p.stockType,
        categoryId: p.categoryId,
        image: p.image || '',
      })
    }

    loadData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      await api.put(`/products/${id}`, {
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
      console.error('Update failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-xl space-y-4">
        <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2" />
        <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border p-2" />
        <input name="offerPrice" type="number" value={form.offerPrice} onChange={handleChange} className="w-full border p-2" />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full border p-2" />

        <select name="stockType" value={form.stockType} onChange={handleChange} className="w-full border p-2">
          <option value="quantity">Quantity</option>
          <option value="kg">Kg</option>
        </select>

        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border p-2">
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button className="bg-black text-white px-4 py-2 rounded">
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  )
}

export default EditProduct
