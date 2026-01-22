import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // backend URL
  withCredentials: true, // 🔥 REQUIRED for guestId cookie
})

// 🔐 Attach JWT token automatically
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error),
)

// ❌ Optional: global error logging (safe)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request')
    }
    return Promise.reject(error)
  },
)

export default api
