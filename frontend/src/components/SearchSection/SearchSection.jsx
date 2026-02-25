import { MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const SearchSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState({ location: false, search: false });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else if (location.trim()) {
      navigate('/restaurants');
    }
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-md border-y border-gray-100 py-8 lg:py-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-2xl md:rounded-full shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
          
          {/* Location Input */}
          <div className={`relative flex-1 w-full flex items-center transition-colors duration-300 rounded-xl md:rounded-l-full md:rounded-r-none ${isFocused.location ? 'bg-orange-50/50' : 'bg-transparent'}`}>
            <MapPin 
              size={20} 
              className={`absolute left-4 z-10 transition-colors duration-300 ${isFocused.location ? 'text-orange-600' : 'text-gray-400'}`} 
            />
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setIsFocused(prev => ({ ...prev, location: true }))}
              onBlur={() => setIsFocused(prev => ({ ...prev, location: false }))}
              placeholder="Enter delivery location"
              className="w-full h-14 pl-12 pr-4 text-base border-none rounded-xl md:rounded-l-full md:rounded-r-none bg-transparent hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-gray-800 shadow-none font-medium"
            />
            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gray-200 absolute right-0" />
          </div>
          
          {/* Search Input */}
          <div className={`relative flex-1 w-full flex items-center transition-colors duration-300 rounded-xl md:rounded-none ${isFocused.search ? 'bg-orange-50/50' : 'bg-transparent'}`}>
            <Search 
              size={20} 
              className={`absolute left-4 md:left-6 z-10 transition-colors duration-300 ${isFocused.search ? 'text-orange-600' : 'text-gray-400'}`} 
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(prev => ({ ...prev, search: true }))}
              onBlur={() => setIsFocused(prev => ({ ...prev, search: false }))}
              placeholder="Search for food or restaurants"
              className="w-full h-14 pl-12 md:pl-16 pr-4 text-base border-none rounded-xl md:rounded-none bg-transparent hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-gray-800 shadow-none font-medium"
            />
          </div>
          
          {/* Search Button */}
          <div className="w-full md:w-auto p-1">
            <Button 
              type="submit"
              size="lg"
              className="w-full h-12 md:px-10 bg-orange-600 text-white text-base font-bold rounded-xl md:rounded-full shadow-md hover:bg-orange-700 hover:shadow-lg transition-all"
            >
              Find Food
            </Button>
          </div>
          
        </form>
      </div>
    </motion.div>
  );
};

export default SearchSection;