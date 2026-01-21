import { useEffect, useState } from 'react'
import api from '../../api/axios'

type Product = {
  id: number
  name: string
  price: number          // MRP
  offerPrice?: number    // discounted price
  stock: number
}

type BillItem = {
  product: Product
  qty: number
}

const BillingPOS = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [bill, setBill] = useState<BillItem[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
const [submitting, setSubmitting] = useState(false)

  const [paymentMode, setPaymentMode] =
    useState<'CASH' | 'UPI' | 'CARD'>('CASH')

  // =========================
  // LOAD PRODUCTS
  // =========================
  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data))
  }, [])

  // =========================
  // ADD PRODUCT TO BILL
  // =========================
  const addToBill = (product: Product) => {
    setBill(prev => {
      const existing = prev.find(b => b.product.id === product.id)
      if (existing) {
        return prev.map(b =>
          b.product.id === product.id
            ? { ...b, qty: b.qty + 1 }
            : b,
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  // =========================
  // QUANTITY CONTROLS
  // =========================
  const increaseQty = (id: number) => {
    setBill(prev =>
      prev.map(b =>
        b.product.id === id ? { ...b, qty: b.qty + 1 } : b,
      ),
    )
  }

  const decreaseQty = (id: number) => {
    setBill(prev =>
      prev
        .map(b =>
          b.product.id === id ? { ...b, qty: b.qty - 1 } : b,
        )
        .filter(b => b.qty > 0),
    )
  }

  const removeItem = (id: number) => {
    setBill(prev => prev.filter(b => b.product.id !== id))
  }

  // =========================
  // TOTAL CALCULATION
  // =========================
  const totals = bill.reduce(
    (acc, b) => {
      const mrp = b.product.price
      const sellPrice = b.product.offerPrice ?? b.product.price

      acc.subtotal += b.qty * sellPrice
      acc.discount += b.qty * (mrp - sellPrice)

      return acc
    },
    { subtotal: 0, discount: 0 },
  )

  const total = totals.subtotal

  // =========================
  // SUBMIT BILL
  // =========================
  const submitBill = async () => {
  await api.post('/staff/billing', {
    items: bill.map(b => ({
      productId: b.product.id,
      quantity: b.qty,
      price: b.product.price,
    })),
    paymentMode,
    totalAmount: total,
  })

  setBill([])
  setPaymentMode('CASH')
}


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Billing POS</h1>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {products.map(p => (
          <button
            key={p.id}
            onClick={() => addToBill(p)}
            className="border p-3 rounded hover:bg-gray-100 text-left"
          >
            <p className="font-medium">{p.name}</p>

            {p.offerPrice && p.offerPrice < p.price ? (
              <>
                <p className="text-xs line-through text-gray-400">
                  MRP ₹{p.price}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  ₹{p.offerPrice}
                </p>
              </>
            ) : (
              <p className="text-sm">₹{p.price}</p>
            )}

            <p className="text-xs text-gray-500">
              Stock: {p.stock}
            </p>
          </button>
        ))}
      </div>

      {/* BILL */}
      <div className="bg-white p-5 rounded shadow max-w-lg">
        <h2 className="font-semibold mb-3">Current Bill</h2>

        {bill.length === 0 && (
          <p className="text-gray-500 text-sm">
            No items added
          </p>
        )}

        {bill.map(b => {
          const mrp = b.product.price
          const sellPrice =
            b.product.offerPrice ?? b.product.price

          return (
            <div
              key={b.product.id}
              className="flex justify-between items-center mb-3"
            >
              <div className="w-40">
                <p className="font-medium">{b.product.name}</p>

                {sellPrice < mrp ? (
                  <>
                    <p className="text-xs line-through text-gray-400">
                      MRP ₹{mrp}
                    </p>
                    <p className="text-xs text-green-600">
                      Offer ₹{sellPrice}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-600">
                    Price ₹{mrp}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(b.product.id)}
                  className="px-2 py-1 border rounded"
                >
                  −
                </button>

                <span>{b.qty}</span>

                <button
                  onClick={() => increaseQty(b.product.id)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>

              <span className="w-20 text-right font-medium">
                ₹{b.qty * sellPrice}
              </span>

              <button
                onClick={() => removeItem(b.product.id)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          )
        })}

        <hr className="my-3" />

        <p className="text-sm text-gray-600">
          You save ₹{totals.discount.toFixed(2)}
        </p>

        <p className="font-bold text-lg">
          Total: ₹{total}
        </p>

        <select
          value={paymentMode}
          onChange={e =>
            setPaymentMode(e.target.value as any)
          }
          className="border p-2 mt-3 w-full"
        >
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Card</option>
        </select>

        <button
  type="button"
  onClick={() => {
    if (!bill.length) {
      alert('No items in bill')
      return
    }
    setShowConfirm(true)
  }}
  className="block mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
>
  Complete Sale
</button>

      </div>
      {showConfirm && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-3">
        Confirm Sale
      </h2>

      <div className="text-sm text-gray-700 mb-4 space-y-1">
        <p>
          <strong>Items:</strong> {bill.length}
        </p>
        <p>
          <strong>Payment Mode:</strong> {paymentMode}
        </p>
        <p className="text-lg font-bold mt-2">
          Total: ₹{total}
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          disabled={submitting}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            try {
              setSubmitting(true)
              await submitBill()
              setShowConfirm(false)
            } finally {
              setSubmitting(false)
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {submitting ? 'Processing...' : 'Confirm Sale'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default BillingPOS
        