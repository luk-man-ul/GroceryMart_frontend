import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../auth/AuthContext'
import AuthLayout from './AuthLayout'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', { email, password })
      const token = res.data.access_token
      await login(token)

      const payload = JSON.parse(atob(token.split('.')[1]))
      const role = payload.role

      if (role === 'ADMIN') navigate('/admin', { replace: true })
      else if (role === 'SHOP_STAFF') navigate('/staff/billing', { replace: true })
      else if (role === 'INVENTORY_STAFF') navigate('/staff/inventory', { replace: true })
      else if (role === 'DELIVERY_STAFF') navigate('/staff/delivery', { replace: true })
      else navigate('/', { replace: true })
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-center mb-6">
        Login
      </h1>

      {error && (
        <p className="mb-4 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-2 font-medium"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <div className="mt-6 text-sm text-center space-y-2">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot password?
        </Link>

        <p className="text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login