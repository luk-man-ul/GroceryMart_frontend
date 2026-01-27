import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-center mb-6">
        Forgot Password
      </h1>

      <form className="space-y-4">
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

        <button
          type="submit"
          className="w-full bg-black text-white rounded-lg py-2 font-medium"
        >
          Send Reset Link
        </button>
      </form>

      <div className="mt-6 text-sm text-center">
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword