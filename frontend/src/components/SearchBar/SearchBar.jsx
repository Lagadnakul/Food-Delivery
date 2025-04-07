import React from 'react'
import { assets } from '../../assets/frontend_assets/assets'

const SearchBar = () => {
  return (
    <div className="sticky top-16 z-40 bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <span className="text-2xl">📍</span>
            </div>
            <input
              type="text"
              placeholder="Enter your delivery location"
              className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <img src={assets.search_icon} alt="" className="h-6 w-6" />
            </div>
            <input
              type="text"
              placeholder="Search for food or restaurants"
              className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar