import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Add from './pages/Add/Add.jsx'
import Dashboard from './pages/Dashboard/Dashboard'
import List from './pages/List/List'
import Login from './pages/Login/Login'
import Orders from './pages/Orders/Orders'

// Layout wrapping all protected pages (navbar + sidebar + main)
const AdminLayout = ({ sidebarOpen, toggleSidebar }) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  </ProtectedRoute>
)

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        {/* Redirect root → dashboard (ProtectedRoute handles login redirect) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* All protected routes share the AdminLayout */}
        <Route path="/*" element={<AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  )
}

export default App