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
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'CARD'>('CASH')
  const [searchTerm, setSearchTerm] = useState('')

  // Load products
  useEffect(() => {
    api.get('/products/all').then(res => setProducts(res.data.data))
  }, [])

  // Filter products based on search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Add product to bill
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

  // Quantity controls
  const increaseQty = (id: number) => {
    setBill(prev =>
      prev.map(b =>
        b.product.id === id ? { ...b, qty: b.qty + 1 } : b,
      ),
    )
  }

  const decreaseQty = (id: number) => {
    setBill(prev =>
      prev.map(b =>
        b.product.id === id ? { ...b, qty: b.qty - 1 } : b,
      ).filter(b => b.qty > 0),
    )
  }

  const removeItem = (id: number) => {
    setBill(prev => prev.filter(b => b.product.id !== id))
  }

  const clearBill = () => {
    setBill([])
  }

  // Total calculation
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

  // Submit bill
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Point of Sale</h1>
          <p className="text-gray-600">Fast and efficient billing system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addToBill(p)}
                    className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-left"
                  >
                    <div className="absolute top-2 right-2">
                      <div className={`w-3 h-3 rounded-full ${p.stock > 10 ? 'bg-green-400' : p.stock > 0 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{p.name}</h3>
                    
                    <div className="space-y-1">
                      {p.offerPrice && p.offerPrice < p.price ? (
                        <>
                          <p className="text-xs line-through text-gray-400">₹{p.price}</p>
                          <p className="text-lg font-bold text-green-600">₹{p.offerPrice}</p>
                          <div className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                            {Math.round(((p.price - p.offerPrice) / p.price) * 100)}% OFF
                          </div>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-gray-900">₹{p.price}</p>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">Stock: {p.stock}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bill Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Current Bill</h2>
                {bill.length > 0 && (
                  <button
                    onClick={clearBill}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {bill.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-500">No items added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start by selecting products</p>
                </div>
              ) : (
                <>
                  {/* Bill Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                    {bill.map(b => {
                      const mrp = b.product.price
                      const sellPrice = b.product.offerPrice ?? b.product.price
                      return (
                        <div key={b.product.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{b.product.name}</h4>
                              {sellPrice < mrp ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs line-through text-gray-400">₹{mrp}</span>
                                  <span className="text-sm font-semibold text-green-600">₹{sellPrice}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-600">₹{mrp}</span>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(b.product.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center bg-white rounded-lg border">
                              <button
                                onClick={() => decreaseQty(b.product.id)}
                                className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-4 py-2 font-medium">{b.qty}</span>
                              <button
                                onClick={() => increaseQty(b.product.id)}
                                className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>
                            <span className="font-bold text-gray-900">₹{(b.qty * sellPrice).toFixed(2)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Bill Summary */}
                  <div className="border-t pt-4 space-y-3">
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Total Savings</span>
                        <span className="font-semibold text-green-600">₹{totals.discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">₹{total.toFixed(2)}</span>
                    </div>

                    {/* Payment Mode */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['CASH', 'UPI', 'CARD'] as const).map(mode => (
                          <button
                            key={mode}
                            onClick={() => setPaymentMode(mode)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                              paymentMode === mode
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Complete Sale Button */}
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Complete Sale
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Sale</h2>
                <p className="text-gray-600">Please review the transaction details</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-semibold">{bill.length} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold">{paymentMode}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Savings</span>
                    <span className="font-semibold text-green-600">₹{totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Amount</span>
                    <span className="text-blue-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'Confirm Sale'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BillingPOS