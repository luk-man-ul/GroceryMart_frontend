import { createContext, useContext, useEffect, useState } from 'react'
import type { JwtPayload, UserRole } from '../types'
import api from '../api/axios'

interface AuthContextType {
  token: string | null
  role: UserRole | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      const payload = JSON.parse(atob(storedToken.split('.')[1])) as JwtPayload
      setRole(payload.role)
    }
  }, [])

 const login = async (jwt: string) => {
  localStorage.setItem('token', jwt)
  setToken(jwt)

  const payload = JSON.parse(atob(jwt.split('.')[1])) as JwtPayload
  setRole(payload.role)

  try {
    await api.post('/cart/merge')
  } catch (err) {
    console.error('Cart merge failed', err)
  }
}

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
