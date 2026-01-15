import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // backend URL
  withCredentials: true,            // REQUIRED for guestId cookie
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }

    return config
  },
  error => Promise.reject(error)
)

export default api
