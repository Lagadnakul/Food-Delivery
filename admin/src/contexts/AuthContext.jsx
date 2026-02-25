import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adminLogin } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)         // { name, email }
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)     // hydrating from localStorage

  // Hydrate auth state from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken')
    const savedAdmin = localStorage.getItem('adminUser')
    if (savedToken && savedAdmin) {
      setToken(savedToken)
      setAdmin(JSON.parse(savedAdmin))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const result = await adminLogin(email, password)
    if (result.success) {
      localStorage.setItem('adminToken', result.token)
      localStorage.setItem('adminUser', JSON.stringify(result.admin))
      setToken(result.token)
      setAdmin(result.admin)
      return { success: true }
    }
    return { success: false, message: result.message }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setToken(null)
    setAdmin(null)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
