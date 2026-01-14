import { useAuth } from '../../auth/AuthContext'
const MyAccount = () => {
    const { role ,logout } = useAuth()

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <p className="text-gray-600">Role: {role}</p>
      <button onClick={logout} className="mt-4 bg-black text-white px-4 py-2 rounded">
        Logout
    </button>

    </div>
  )
}

export default MyAccount
