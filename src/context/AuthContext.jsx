import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('smartnotes_user') || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem('smartnotes_token'))
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    function expireSession() {
      setToken(null)
      setUser(null)
      setSessionExpired(true)
    }
    window.addEventListener('smartnotes:session-expired', expireSession)
    return () => window.removeEventListener('smartnotes:session-expired', expireSession)
  }, [])

  async function login(credentials) {
    const { data } = await api.post('/api/auth/login', credentials)
    const nextToken = data?.token || data?.jwt || data?.accessToken
    if (!nextToken) {
      throw new Error('The server response did not include a JWT token.')
    }
    const nextUser = data.user || {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    }
    localStorage.setItem('smartnotes_token', nextToken)
    localStorage.setItem('smartnotes_user', JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
    setSessionExpired(false)
    return nextUser
  }

  function logout() {
    localStorage.removeItem('smartnotes_token')
    localStorage.removeItem('smartnotes_user')
    setToken(null)
    setUser(null)
    setSessionExpired(false)
  }

  const value = useMemo(() => ({ user, token, sessionExpired, login, logout }), [user, token, sessionExpired])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
