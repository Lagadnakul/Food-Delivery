import axios from 'axios'
import { useEffect, useState } from 'react'
import { url } from '../../assets/assets'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItems: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch food items
      const foodResponse = await axios.get(`${url}/food/list`)
      const foodItems = foodResponse.data.success ? foodResponse.data.data : []

      // Fetch orders
      const ordersResponse = await axios.get(`${url}/order/list`)
      const orders = ordersResponse.data.success ? ordersResponse.data.data : []

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0)
      const pendingOrders = orders.filter(order => order.status !== 'Delivered').length

      setStats({
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalItems: foodItems.length,
        pendingOrders: pendingOrders
      })

      setRecentOrders(orders.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Food Items',
      value: stats.totalItems,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700'
      case 'Out for Delivery': return 'bg-blue-100 text-blue-700'
      case 'Processing': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
          <div className="mt-4 text-slate-600 font-medium">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your restaurant.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <span className={card.textColor}>{card.icon}</span>
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +12%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{card.value}</h3>
            <p className="text-slate-500 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
            <a href="/orders" className="text-orange-500 font-medium text-sm hover:text-orange-600 flex items-center gap-1">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{order.address?.firstName} {order.address?.lastName}</p>
                      <p className="text-sm text-slate-500">{order.items?.length || 0} items • ₹{order.amount}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-slate-500">No orders yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <a href="/add" className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white hover:from-orange-600 hover:to-orange-700 transition-all">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Add New Item</p>
                <p className="text-sm text-white/80">Add food to menu</p>
              </div>
            </a>

            <a href="/list" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl text-slate-700 hover:bg-slate-100 transition-all">
              <div className="p-2 bg-slate-200 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Manage Menu</p>
                <p className="text-sm text-slate-500">View all items</p>
              </div>
            </a>

            <a href="/orders" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl text-slate-700 hover:bg-slate-100 transition-all">
              <div className="p-2 bg-slate-200 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">View Orders</p>
                <p className="text-sm text-slate-500">Manage orders</p>
              </div>
            </a>
          </div>

          {/* Performance Card */}
          <div className="mt-6 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="font-semibold">Performance</p>
            </div>
            <p className="text-sm text-slate-300 mb-4">Your restaurant is performing 23% better than last month!</p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
