import axios from 'axios'

const apiBaseURL = (
  import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:8080' : '')
).replace(/\/+$/, '')

const api = axios.create({
  baseURL: apiBaseURL,
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  if (!apiBaseURL) {
    throw new Error('Set VITE_API_BASE_URL to the deployed backend URL in your Vercel project settings.')
  }
  const path = config.url?.split('?')[0]
  const isPublicAuthRequest = config.method?.toLowerCase() === 'post'
    && (path === '/api/auth/login' || path === '/api/auth/register')
  const token = localStorage.getItem('smartnotes_token')
  if (token && !isPublicAuthRequest) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadAuthenticatedRequest = Boolean(error.config?.headers?.Authorization)
    if (error.response?.status === 401 && hadAuthenticatedRequest) {
      localStorage.removeItem('smartnotes_token')
      localStorage.removeItem('smartnotes_user')
      window.dispatchEvent(new Event('smartnotes:session-expired'))
    }
    return Promise.reject(error)
  },
)

export function getApiError(error) {
  const data = error?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return data.message
  if (data?.detail) return data.detail
  if (data?.title) return data.title
  if (data?.error) return data.error
  if (error?.message === 'Network Error') {
    return 'Unable to reach the server. Check that the backend is running and try again.'
  }
  return error?.message || 'Something went wrong. Please try again.'
}

export default api
