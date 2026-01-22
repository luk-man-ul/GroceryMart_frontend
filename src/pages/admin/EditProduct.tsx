import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

interface Category {
  id: number
  name: string
}

interface ProductForm {
  name: string
  price: number
  offerPrice: number | ''
  stockType: string
  categoryId: number
  image: string
  stock: number // read-only display
}

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [form, setForm] = useState<ProductForm>({
    name: '',
    price: 0,
    offerPrice: '',
    stockType: 'quantity',
    categoryId: 0,
    image: '',
    stock: 0,
  })

  // =========================
  // LOAD PRODUCT + CATEGORIES
  // =========================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${id}`),
        ])

        setCategories(catRes.data)

        const p = prodRes.data
        setForm({
          name: p.name,
          price: p.price,
          offerPrice: p.offerPrice ?? '',
          stockType: p.stockType,
          categoryId: p.categoryId,
          image: p.image ?? '',
          stock: p.stock,
        })
      } catch (err) {
        console.error('Failed to load product', err)
      } finally {
        setPageLoading(false)
      }
    }

    loadData()
  }, [id])

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]:
        name === 'price' || name === 'categoryId'
          ? Number(value)
          : value,
    }))
  }

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      await api.put(`/products/${id}`, {
        name: form.name,
        price: form.price,
        offerPrice:
          form.offerPrice === ''
            ? null
            : Number(form.offerPrice),
        stockType: form.stockType,
        categoryId: form.categoryId,
        image: form.image || null,
      })

      navigate('/admin/products')
    } catch (err) {
      console.error('Update failed', err)
      alert('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return <p>Loading product...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-xl space-y-6"
      >
        {/* PRODUCT NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* PRICING */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Price
            </label>
            <input
              name="price"
              type="number"
              min={0}
              value={form.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Offer Price (optional)
            </label>
            <input
              name="offerPrice"
              type="number"
              min={0}
              value={form.offerPrice}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* IMAGE URL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <input
            name="image"
            type="url"
            placeholder="https://example.com/product.jpg"
            value={form.image}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* IMAGE PREVIEW */}
          {form.image && (
            <img
              src={form.image}
              alt="Product Preview"
              className="mt-3 h-32 object-contain border rounded"
              onError={e =>
                ((e.target as HTMLImageElement).style.display =
                  'none')
              }
            />
          )}
        </div>

        {/* INVENTORY INFO (READ-ONLY) */}
        <div className="bg-gray-50 p-4 rounded border">
          <p className="text-sm text-gray-600 mb-1">
            Current Stock
          </p>
          <p className="font-semibold">
            {form.stock} ({form.stockType})
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Stock can be updated only from Inventory
            panel
          </p>
        </div>

        {/* STOCK TYPE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Stock Type
          </label>
          <select
            name="stockType"
            value={form.stockType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="quantity">
              Quantity
            </option>
            <option value="kg">Kg</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading
              ? 'Updating...'
              : 'Update Product'}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate('/admin/products')
            }
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
