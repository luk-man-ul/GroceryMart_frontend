import { useState } from 'react'
import { Link } from 'react-router-dom'
const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button className="w-full bg-black text-white rounded-lg py-2">
              Send Reset Link
            </button>
            <h3 className="text-center text-sm font-medium">X</h3>
            <div className="mt-6 text-sm text-center space-y-2">
          <Link to="/Login" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
          </form>

        ) : (
          <p className="text-sm text-green-600 text-center">
            If an account exists, a reset link has been sent.
          </p>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
