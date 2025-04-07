import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-b from-orange-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-left">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
              <span className="block">Your Favorite Food</span>
              <span className="block text-orange-500">Delivered Fresh & Fast</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Experience the finest cuisine delivered right to your doorstep. 
              Choose from our wide selection of restaurants and cuisines.
            </p>
            <div className="flex flex-wrap gap-4">
  <Link 
    to="/menu" 
    className="px-8 py-3 text-lg font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transform hover:scale-105 transition-all"
  >
    Order Now
  </Link>
  <Link 
    to="/restaurants" 
    className="px-8 py-3 text-lg font-semibold text-orange-500 border-2 border-orange-500 rounded-full hover:bg-orange-50 transform hover:scale-105 transition-all"
  >
    View Restaurants
  </Link>
</div>
          </div>
          <div className="relative animate-fade-in-right">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full filter blur-3xl transform rotate-6"></div>
            <img 
              src={assets.header_img} 
              alt="Featured Food"
              className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection