import { motion } from 'framer-motion'
import { MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchSection = () => {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState({ location: false, search: false })

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`)
    } else if (location.trim()) {
      // Could implement location-based search here
      navigate('/restaurants')
    }
  }

  return (
    <motion.div 
      className="bg-white shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container-padding py-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto">
          {/* Location Input */}
          <motion.div 
            className={`relative flex-1 w-full transition-all duration-300 ${isFocused.location ? 'scale-[1.02]' : ''}`}
            whileHover={{ scale: 1.01 }}
          >
            <MapPin 
              size={20} 
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused.location ? 'text-orange-500' : 'text-gray-400'}`} 
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setIsFocused(prev => ({ ...prev, location: true }))}
              onBlur={() => setIsFocused(prev => ({ ...prev, location: false }))}
              placeholder="Enter your delivery location"
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl 
                       bg-gray-50 hover:bg-white focus:bg-white
                       focus:border-orange-500 focus:ring-4 focus:ring-orange-100
                       transition-all duration-300 outline-none text-gray-700"
            />
          </motion.div>
          
          {/* Search Input */}
          <motion.div 
            className={`relative flex-1 w-full transition-all duration-300 ${isFocused.search ? 'scale-[1.02]' : ''}`}
            whileHover={{ scale: 1.01 }}
          >
            <Search 
              size={20} 
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused.search ? 'text-orange-500' : 'text-gray-400'}`} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(prev => ({ ...prev, search: true }))}
              onBlur={() => setIsFocused(prev => ({ ...prev, search: false }))}
              placeholder="Search food or restaurants"
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl 
                       bg-gray-50 hover:bg-white focus:bg-white
                       focus:border-orange-500 focus:ring-4 focus:ring-orange-100
                       transition-all duration-300 outline-none text-gray-700"
            />
          </motion.div>
          
          {/* Search Button */}
          <motion.button 
            type="submit"
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 
                     text-white font-semibold rounded-xl shadow-lg shadow-orange-200
                     hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-300
                     transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Find Food
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}

export default SearchSection