import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { JwtPayload, UserRole } from '../types'
import api from '../api/axios'
import { useCart } from '../cart/CartContext'

interface AuthContextType {
  token: string | null
  role: UserRole | null
  authReady: boolean
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext =
  createContext<AuthContextType | null>(null)

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [token, setToken] = useState<string | null>(
    null,
  )
  const [role, setRole] = useState<UserRole | null>(
    null,
  )
  const [authReady, setAuthReady] = useState(false)

  const { refreshCart } = useCart()

  // ===============================
  // 🔁 Restore auth on app load
  // ===============================
  useEffect(() => {
    const storedToken =
      localStorage.getItem('token')

    if (storedToken) {
      try {
        const payload = JSON.parse(
          atob(storedToken.split('.')[1]),
        ) as JwtPayload

        setToken(storedToken)
        setRole(payload.role)
      } catch {
        localStorage.removeItem('token')
      }
    }

    setAuthReady(true)
  }, [])

  // ===============================
  // 🔐 LOGIN + AUTO CART MERGE
  // ===============================
  const login = async (jwt: string) => {
    // 1️⃣ Save token
    localStorage.setItem('token', jwt)

    const payload = JSON.parse(
      atob(jwt.split('.')[1]),
    ) as JwtPayload

    setToken(jwt)
    setRole(payload.role)

    // 2️⃣ 🔥 AUTO MERGE GUEST CART → USER CART
    try {
      await api.post('/cart/merge')
    } catch (err) {
      console.warn(
        'Guest cart merge skipped:',
        err,
      )
    }

    // 3️⃣ Refresh cart AFTER merge
    await refreshCart()
  }

  // ===============================
  // 🚪 LOGOUT
  // ===============================
const logout = async () => {
  // 1️⃣ Remove auth
  localStorage.removeItem('token')
  setToken(null)
  setRole(null)

  // 2️⃣ Clear stale user cart immediately
  // clearCart()

  // 3️⃣ Re-fetch cart as GUEST
  await refreshCart()
}



  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        authReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    )
  }
  return context
}
