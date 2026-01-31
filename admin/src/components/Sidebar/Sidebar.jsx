import { NavLink, useLocation } from 'react-router-dom'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      path: '/add',
      name: 'Add Items',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      path: '/list',
      name: 'Food Items',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    {
      path: '/orders',
      name: 'Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      badge: '12'
    }
  ]

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 shadow-sm transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-full">
        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200' 
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && (
                <>
                  <span className="font-medium flex-1">{item.name}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      location.pathname === item.path 
                        ? 'bg-white/20 text-white' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-200">
          {isOpen ? (
            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Need Help?</p>
                  <p className="text-xs text-slate-500">Check our docs</p>
                </div>
              </div>
              <button className="w-full py-2 text-sm font-medium text-orange-600 bg-white rounded-lg hover:bg-orange-50 transition-colors">
                Documentation
              </button>
            </div>
          ) : (
            <button className="w-full p-3 bg-orange-100 rounded-xl hover:bg-orange-200 transition-colors">
              <svg className="w-5 h-5 text-orange-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar