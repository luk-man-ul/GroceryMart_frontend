import { createContext, useContext, useEffect, useRef, useState } from 'react'
import api from '../api/axios'
import type { CartItem } from '../types'

type CartContextType = {
  items: CartItem[]
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const requestIdRef = useRef(0) // 🔒 prevents race conditions

  const refreshCart = async () => {
    const requestId = ++requestIdRef.current

    try {
      const res = await api.get('/cart')

      // ❗ only apply the latest response
      if (requestId === requestIdRef.current) {
        setItems(res.data?.items ?? [])
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setItems([])
      }
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  return (
    <CartContext.Provider value={{ items, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
