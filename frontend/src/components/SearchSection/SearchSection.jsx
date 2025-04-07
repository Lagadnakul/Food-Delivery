import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const SearchSection = () => {
  const [location, setLocation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    if (!location.trim()) {
      alert('Please enter a delivery location')
      return
    }
    // Handle search logic here
    console.log('Searching:', { location, searchQuery })
  }

  return (
    <div className="sticky top-16 z-40 bg-white shadow-lg">
      <div className="container-padding py-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📍</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your delivery location"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                       focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div className="relative flex-1">
            <img 
              src={assets.search_icon} 
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" 
              alt="Search"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food or restaurants"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                       focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <button 
            onClick={handleSearch}
            className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-xl 
                    hover:bg-orange-600 transform hover:scale-105 transition-all"
          >
            Find Food
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchSection