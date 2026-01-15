import { createContext, useContext, useEffect, useRef, useState } from 'react'
import api from '../api/axios'
import type { CartItem } from '../types'
import { useAuth } from '../auth/AuthContext'

type CartContextType = {
  items: CartItem[]
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const requestIdRef = useRef(0)

  const { token, authReady } = useAuth()

  const refreshCart = async () => {
    const requestId = ++requestIdRef.current

    try {
      const res = await api.get('/cart')

      if (requestId === requestIdRef.current) {
        setItems(res.data?.items ?? [])
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setItems([])
      }
    }
  }

  // 🔑 THIS is the fix: react ONLY to auth changes
  useEffect(() => {
    if (!authReady) return

    refreshCart()
  }, [token, authReady])

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
