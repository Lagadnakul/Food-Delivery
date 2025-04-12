import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { url } from '../../assets/assets'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Status options
  const statusOptions = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled']
  
  // Status colors
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'preparing': 'bg-blue-100 text-blue-800',
    'out-for-delivery': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}/orders`)
      if (response.data.success) {
        setOrders(response.data.data)
        toast.success("Orders loaded successfully")
      } else {
        toast.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Error loading orders. Please check if your server is running.")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      const response = await axios.patch(`${url}/orders/${orderId}/status`, { status })
      if (response.data.success) {
        setOrders(prevOrders => prevOrders.map(order => 
          order._id === orderId ? { ...order, status } : order
        ))
        toast.success(`Order status updated to ${status}`)
      } else {
        toast.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Error updating order status")
    } finally {
      setUpdating(null)
    }
  }

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }
    return new Date(dateString).toLocaleString('en-US', options)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = searchTerm === '' || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
            <p className="text-gray-600">View and manage customer orders</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <svg className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by order ID, customer name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results summary */}
      {!loading && (
        <div className="mb-4 text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders 
          {(searchTerm || filterStatus !== 'all') && (
            <span> (filtered)</span>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <p className="text-gray-500 font-medium">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-xl font-bold text-gray-700">No Orders Found</h3>
          <p className="mt-2 text-gray-500">
            {orders.length === 0 
              ? "There are no orders in the system yet." 
              : "No orders match your search criteria."}
          </p>
          {(searchTerm || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Order Total:</p>
                      <p className="text-lg font-bold text-orange-600">{formatCurrency(order.payment.total)}</p>
                    </div>
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Extended Order Details */}
              {expandedOrder === order._id && (
                <div className="border-b border-gray-100">
                  {/* Customer Info */}
                  <div className="p-6 bg-gray-50">
                    <h4 className="text-md font-medium text-gray-700 mb-4">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Name</p>
                        <p className="font-medium">{order.customer.name}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="font-medium">{order.customer.phone}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <p className="font-medium">{order.customer.address}</p>
                      </div>
                    </div>
                    {order.customer.instructions && (
                      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Instructions</p>
                        <p>{order.customer.instructions}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-6">
                    <h4 className="text-md font-medium text-gray-700 mb-4">Order Items</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 rounded-l-lg">Item</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Quantity</th>
                            <th className="px-4 py-3 rounded-r-lg">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {order.items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                    {item.image && (
                                      <img 
                                        src={item.image.startsWith('http') ? item.image : `${url}/uploads/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.src = 'https://via.placeholder.com/40x40?text=Food';
                                        }}
                                      />
                                    )}
                                  </div>
                                  <span className="font-medium">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">{formatCurrency(item.price)}</td>
                              <td className="px-4 py-3">{item.quantity}x</td>
                              <td className="px-4 py-3">{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-right font-medium">Subtotal</td>
                            <td className="px-4 py-3">{formatCurrency(order.payment.subtotal)}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-right font-medium">Tax</td>
                            <td className="px-4 py-3">{formatCurrency(order.payment.tax)}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-right font-medium">Delivery Fee</td>
                            <td className="px-4 py-3">{formatCurrency(order.payment.deliveryFee)}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-right font-bold">Total</td>
                            <td className="px-4 py-3 font-bold">{formatCurrency(order.payment.total)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  
                  {/* Payment Info */}
                  <div className="p-6 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Payment Information</h4>
                        <p className="text-sm text-gray-600">Method: <span className="font-medium capitalize">{order.payment.method}</span></p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Order Actions */}
              <div className="p-4 bg-gray-50">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Status: </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className={`ml-2 border-gray-300 rounded p-1.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${statusColors[order.status] || 'bg-white'}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                    {updating === order._id && (
                      <span className="inline-block ml-2">
                        <svg className="animate-spin h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`Order #${order._id}`);
                        toast.success("Order ID copied to clipboard");
                      }}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy ID
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders