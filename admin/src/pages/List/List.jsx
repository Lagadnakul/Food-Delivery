import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { url } from '../../assets/assets'

const List = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    fetchList()
  }, [])

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}/food/list`)
      if (response.data.success) {
        setList(response.data.data)
        toast.success("Menu items loaded successfully")
      } else {
        toast.error("Failed to fetch food items")
      }
    } catch (error) {
      console.error("Error fetching list:", error)
      toast.error("Error loading food items. Please check if your server is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      const response = await axios.post(`${url}/food/remove`, { id })
      if (response.data.success) {
        setList(prev => prev.filter(item => item._id !== id))
        toast.success("Food item removed successfully")
      } else {
        toast.error("Failed to remove item")
      }
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Error removing food item")
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
  }

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(list.map(item => item.category).filter(Boolean))]

  // Filter food items based on search and category
  const filteredList = list.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Food Menu Items</h1>
            <p className="text-gray-600">Manage your restaurant's menu offerings</p>
          </div>
          <Link 
            to="/add" 
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium 
                      rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors shadow-md 
                      hover:shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Item
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name or description..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
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
          <div className="flex gap-2">
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={resetFilters}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
            <button
              onClick={fetchList}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <svg className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Results summary */}
      {!loading && (
        <div className="mb-4 text-gray-600">
          Showing {filteredList.length} of {list.length} items 
          {(searchTerm || selectedCategory !== 'All') && (
            <span> (filtered)</span>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <p className="text-gray-500 font-medium">Loading menu items...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-4 text-xl font-bold text-gray-700">No Food Items Found</h3>
          <p className="mt-2 text-gray-500">
            {list.length === 0 
              ? "Get started by adding menu items to your restaurant." 
              : "Try adjusting your search or filter criteria."}
          </p>
          {list.length === 0 ? (
            <Link 
              to="/add" 
              className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Your First Item
            </Link>
          ) : (
            <button
              onClick={resetFilters}
              className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48">
                <img
                  src={`http://localhost:4000/uploads/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image'
                  }}
                />
                <div className="absolute top-0 right-0 p-2 flex gap-2">
                  <Link 
                    to={`/add?edit=${item._id}`}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-100 transition-colors"
                  >
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(item._id)}
                    disabled={deleting === item._id}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-100 transition-colors"
                  >
                    {deleting === item._id ? (
                      <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full py-2 px-4">
                  <span className="text-xs font-medium text-white px-2 py-1 bg-orange-500 rounded-full">
                    {item.category || "Uncategorized"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                  <span className="font-bold text-orange-500">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
              </div>

              {/* Confirmation dialog */}
              {confirmDelete === item._id && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-3">Are you sure you want to delete this item?</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default List