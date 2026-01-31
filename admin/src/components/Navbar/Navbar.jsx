import { useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = ({ toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left Section - Logo & Menu Toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src={assets.HH_logo} className="h-10 w-auto" alt="Hunger Hive" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-800">Hunger Hive</h1>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <img 
                src={assets.profile_image} 
                className="w-9 h-9 rounded-full object-cover border-2 border-orange-400" 
                alt="Profile" 
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <svg className="w-4 h-4 text-slate-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-800">Admin User</p>
                  <p className="text-xs text-slate-500">admin@hungerhive.com</p>
                </div>
                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
                <div className="border-t border-slate-100 mt-2 pt-2">
                  <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar