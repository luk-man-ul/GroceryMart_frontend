import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'


interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  price: number
  stock: number
  stockType: string
  category: Category
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showTrash, setShowTrash] = useState(false)

  const restoreProduct = async (id: number) => {
  try {
    await api.post(`/products/${id}/restore`)
    fetchProducts()
  } catch (err) {
    console.error('Restore failed', err)
  }
}


  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products', {
  params: {
    trash: showTrash,
  },
})

      setProducts(res.data)
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this product?')
    if (!confirm) return

    try {
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product', err)
    }
  }

  useEffect(() => {
  fetchProducts()
}, [showTrash])


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Product Management</h1>

        <button
            onClick={() => navigate('/admin/products/add')} className="bg-black text-white px-4 py-2 rounded">
            Add Product
        </button>
      </div>
      <div className="flex gap-4 mb-4">
  <button
    onClick={() => setShowTrash(false)}
    className={`px-4 py-2 rounded ${
      !showTrash ? 'bg-black text-white' : 'border'
    }`}
  >
    Active Products
  </button>

  <button
    onClick={() => setShowTrash(true)}
    className={`px-4 py-2 rounded ${
      showTrash ? 'bg-black text-white' : 'border'
    }`}
  >
    Deleted Products
  </button>
</div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t">
                <td className="p-3">{product.name}</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">
                  {product.stock} {product.stockType}
                </td>
                <td className="p-3">{product.category?.name}</td>
                <td className="p-3 space-x-3">
                 <td className="p-3 space-x-3">
  {!showTrash ? (
    <>
      <button
        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
        className="text-blue-600 hover:underline"
      >
        Edit
      </button>

      <button
        onClick={() => deleteProduct(product.id)}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>
    </>
  ) : (
    <button
      onClick={() => restoreProduct(product.id)}
      className="text-green-600 hover:underline"
    >
      Restore
    </button>
  )}
</td>

                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminProducts
