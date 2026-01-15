import { createContext, useContext, useEffect, useState } from 'react'
import type { JwtPayload, UserRole } from '../types'
import api from '../api/axios'

interface AuthContextType {
  token: string | null
  role: UserRole | null
  authReady: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [authReady, setAuthReady] = useState(false)

  // 🔁 Restore auth on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')

    if (storedToken) {
      setToken(storedToken)
      const payload = JSON.parse(atob(storedToken.split('.')[1])) as JwtPayload
      setRole(payload.role)
    }

    setAuthReady(true)
  }, [])

  // 🔐 LOGIN
  const login = async (jwt: string) => {
    localStorage.setItem('token', jwt)
    setToken(jwt)

    const payload = JSON.parse(atob(jwt.split('.')[1])) as JwtPayload
    setRole(payload.role)

    // merge guest cart → user cart
    try {
      await api.post('/cart/merge')
    } catch (err) {
      console.error('Cart merge failed', err)
    }
  }

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setRole(null)
    // guest cart will be picked automatically via cookie
  }

  return (
    <AuthContext.Provider
      value={{ token, role, authReady, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
