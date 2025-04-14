import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [showStatusInfo, setShowStatusInfo] = useState(false)
  
  // Server connection status - this can be integrated with your actual backend status
  const serverStatus = {
    isConnected: false,
    lastChecked: new Date(),
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000'
  }

  const checkServerConnection = async () => {
    setShowStatusInfo(!showStatusInfo)
    // This function can be expanded to actually check server connectivity
  }

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img src={assets.HH_logo} className="h-14 w-auto" alt="Hunger Hive" />
            <span className="ml-2 text-xl font-bold text-gray-900 hidden md:block">
              Admin Dashboard
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Server Status Indicator */}
          <button 
            onClick={checkServerConnection}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            title="Check server connection"
          >
            <div className={`w-2 h-2 rounded-full ${serverStatus.isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="hidden md:inline text-gray-600">
              {serverStatus.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </button>
          
          {/* Profile */}
          <div className="relative">
            <button className="flex items-center rounded-full p-1 hover:bg-gray-100 transition-colors">
              <img 
                src={assets.profile_image} 
                className="w-10 h-10 rounded-full object-cover" 
                alt="Profile" 
              />
              <span className="hidden md:block ml-2 font-medium text-gray-700">Admin</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Server Status Information - Show conditionally */}
      {showStatusInfo && (
        <div className="absolute right-4 top-16 bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-80 z-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-900">Server Status</h3>
            <button 
              onClick={() => setShowStatusInfo(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">API URL:</span>
              <span className="font-medium text-gray-800">{serverStatus.apiUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className={`font-medium ${serverStatus.isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {serverStatus.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Checked:</span>
              <span className="font-medium text-gray-800">
                {serverStatus.lastChecked.toLocaleTimeString()}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-100">
              <button 
                onClick={() => {
                  // Logic to attempt reconnection or refresh server status
                  setShowStatusInfo(false)
                }}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-center font-medium transition-colors"
              >
                Test Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar