import { useEffect, useState } from 'react'
import api from '../../api/axios'

interface Product {
  id: number
  name: string
  stock: number
  stockType: string
  lowStock: boolean
}

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [quantities, setQuantities] = useState<
    Record<number, number>
  >({})
  const [updating, setUpdating] = useState<number | null>(null)

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get(
        '/staff/inventory/products',
      )
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to load inventory', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // =========================
  // ADD STOCK
  // =========================
  const addStock = async (productId: number) => {
    const qty = quantities[productId]

    if (!qty || qty <= 0) {
      alert('Enter a valid quantity')
      return
    }

    try {
      setUpdating(productId)

      await api.patch(
        `/staff/inventory/${productId}/add-stock`,
        { quantity: qty },
      )

      // refresh inventory from backend (source of truth)
      await fetchProducts()

      // reset input
      setQuantities(prev => ({
        ...prev,
        [productId]: 0,
      }))
    } catch (err) {
      console.error('Failed to add stock', err)
      alert('Stock update failed')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Inventory Management
      </h1>

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <div
              key={product.id}
              className={`p-4 rounded border flex justify-between items-center ${
                product.lowStock
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              {/* PRODUCT INFO */}
              <div>
                <p className="font-medium">
                  {product.name}
                </p>
                <p className="text-sm text-gray-600">
                  Stock: {product.stock}{' '}
                  {product.stockType}
                </p>
                {product.lowStock && (
                  <p className="text-sm text-red-600">
                    Low stock
                  </p>
                )}
              </div>

              {/* ADD STOCK */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={quantities[product.id] || ''}
                  onChange={e =>
                    setQuantities(prev => ({
                      ...prev,
                      [product.id]: Number(
                        e.target.value,
                      ),
                    }))
                  }
                  className="w-24 border p-2 rounded"
                  placeholder="+Qty"
                />

                <button
                  onClick={() =>
                    addStock(product.id)
                  }
                  disabled={updating === product.id}
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <p className="text-gray-500">
              No products found
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Inventory
