import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import api from '../api/axios'
import type { CartItem } from '../types'

type CartContextType = {
  items: CartItem[]
  loading: boolean
  refreshCart: () => Promise<void>
}

const CartContext =
  createContext<CartContextType | null>(null)

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Prevent stale responses
  const requestIdRef = useRef(0)

  /**
   * 🔄 Fetch cart (AUTH-AGNOSTIC)
   */
  const refreshCart = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setLoading(true)

    try {
      const res = await api.get('/cart')

      if (requestId === requestIdRef.current) {
        setItems(res.data?.items ?? [])
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setItems([])
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [])

  /**
   * 🔁 Load cart once on app start
   */
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error(
      'useCart must be inside CartProvider',
    )
  }
  return ctx
}
