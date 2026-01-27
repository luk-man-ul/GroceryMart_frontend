import { useEffect, useState } from 'react'
import api from '../../api/axios'

const ROLES = [
  { value: 'SHOP_STAFF', label: 'Shop Staff', color: 'blue', icon: '🏪' },
  { value: 'DELIVERY_STAFF', label: 'Delivery Staff', color: 'green', icon: '🚚' },
  { value: 'INVENTORY_STAFF', label: 'Inventory Staff', color: 'purple', icon: '📦' },
]

type Staff = {
  id: number
  name: string
  email: string
  role: string
  isActive: boolean
}

const AdminStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SHOP_STAFF',
  })

  // Filter staff based on search, role, and status
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && member.isActive) ||
      (statusFilter === 'disabled' && !member.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Get statistics
  const stats = {
    total: staff.length,
    active: staff.filter(s => s.isActive).length,
    disabled: staff.filter(s => !s.isActive).length,
    shopStaff: staff.filter(s => s.role === 'SHOP_STAFF').length,
    deliveryStaff: staff.filter(s => s.role === 'DELIVERY_STAFF').length,
    inventoryStaff: staff.filter(s => s.role === 'INVENTORY_STAFF').length,
  }

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/staff')
      setStaff(res.data)
    } catch (err) {
      console.error('Failed to load staff', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const addStaff = async () => {
    try {
      const res = await api.post('/admin/staff', form)
      setStaff(prev => [...prev, res.data])
      setShowModal(false)
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'SHOP_STAFF',
      })
    } catch (err) {
      console.error('Failed to add staff', err)
    }
  }

  const updateRole = async (id: number, role: string) => {
    try {
      await api.patch(`/admin/staff/${id}/role`, { role })
      setStaff(prev =>
        prev.map(s => (s.id === id ? { ...s, role } : s))
      )
    } catch (err) {
      console.error('Failed to update role', err)
    }
  }

  const updateStatus = async (id: number, isActive: boolean) => {
    try {
      await api.patch(`/admin/staff/${id}/status`, { isActive })
      setStaff(prev =>
        prev.map(s => (s.id === id ? { ...s, isActive } : s))
      )
    } catch (err) {
      console.error('Failed to update staff status', err)
    }
  }

  const getRoleInfo = (role: string) => {
    return ROLES.find(r => r.value === role) || ROLES[0]
  }

  const getRoleColor = (role: string) => {
    const roleInfo = getRoleInfo(role)
    switch (roleInfo.color) {
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'green': return 'bg-green-100 text-green-800 border-green-200'
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">👥 Staff Management</h1>
            <p className="text-gray-600">Manage your team members and their roles</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 lg:mt-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Staff
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-xl">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disabled</p>
                <p className="text-2xl font-bold text-red-600">{stats.disabled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <span className="text-xl">🏪</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shop Staff</p>
                <p className="text-2xl font-bold text-blue-600">{stats.shopStaff}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <span className="text-xl">🚚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivery</p>
                <p className="text-2xl font-bold text-green-600">{stats.deliveryStaff}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <span className="text-xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory</p>
                <p className="text-2xl font-bold text-purple-600">{stats.inventoryStaff}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.icon} {role.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="disabled">Disabled Only</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-gray-600">Loading staff members...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg className="mx-auto w-20 h-20 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No staff members found</h3>
            <p className="text-gray-500">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? "Try adjusting your search or filters."
                : "Start by adding your first staff member."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map(member => {
              const roleInfo = getRoleInfo(member.role)
              return (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                    !member.isActive ? 'opacity-75' : ''
                  }`}
                >
                  {/* Staff Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-bold">{member.name}</h3>
                          <p className="text-emerald-100 text-sm">{member.email}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                        member.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          member.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs font-medium">
                          {member.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Staff Details */}
                  <div className="p-6">
                    {/* Role Badge */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Current Role</label>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getRoleColor(member.role)}`}>
                        <span className="text-lg">{roleInfo.icon}</span>
                        <span className="font-semibold">{roleInfo.label}</span>
                      </div>
                    </div>

                    {/* Role Selector */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Change Role</label>
                      <select
                        value={member.role}
                        onChange={(e) => updateRole(member.id, e.target.value)}
                        disabled={!member.isActive}
                        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                          !member.isActive
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white'
                        }`}
                      >
                        {ROLES.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.icon} {role.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => updateStatus(member.id, !member.isActive)}
                      className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        member.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {member.isActive ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Disable Staff
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Enable Staff
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer Info */}
        {!loading && filteredStaff.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredStaff.length} of {staff.length} staff members
          </div>
        )}

        {/* Add Staff Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Staff</h2>
                <p className="text-gray-600">Create a new staff member account</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    {ROLES.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.icon} {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addStaff}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
                >
                  Add Staff
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminStaff