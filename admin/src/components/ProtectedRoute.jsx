import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Wraps routes that require admin authentication.
 * Shows nothing while auth state is hydrating from localStorage.
 * Redirects to /login if not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
