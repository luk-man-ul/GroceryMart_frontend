import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import AuthLayout from './AuthLayout'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
      })

      navigate('/login')
    } catch (err: any) {
      console.error('REGISTER ERROR:', err.response?.data)
      setError(
        Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : err.response?.data?.message || 'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-center mb-6">
        Create Account
      </h1>

      {error && (
        <p className="mb-4 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
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
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-2 font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      {/* Links */}
      <div className="mt-6 text-sm text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Register