import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <img src={assets.HH_logo} alt="Hunger Hive" className="h-12 w-auto brightness-0 invert" />
            <p className="text-gray-400 text-sm">
              Experience the finest cuisine delivered right to your doorstep. Your favorite food, delivered fresh & fast.
            </p>
            <div className="flex space-x-4">
              <img src={assets.app_store} alt="App Store" className="h-10 cursor-pointer hover:opacity-80 transition-opacity" />
              <img src={assets.play_store} alt="Play Store" className="h-10 cursor-pointer hover:opacity-80 transition-opacity" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/menu" className="text-gray-400 hover:text-white transition-colors">Menu</Link></li>
              <li><Link to="/mobile-app" className="text-gray-400 hover:text-white transition-colors">Mobile App</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center space-x-3">
                <span>📍</span>
                <span>123 Food Street, LA, USA</span>
              </li>
              <li className="flex items-center space-x-3">
                <span>📞</span>
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center space-x-3">
                <span>✉️</span>
                <span>support@hungerhive.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <img src={assets.facebook_icon} alt="Facebook" className="h-5 w-5 brightness-0 invert" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <img src={assets.twitter_icon} alt="Twitter" className="h-5 w-5 brightness-0 invert" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <img src={assets.linkedin_icon} alt="LinkedIn" className="h-5 w-5 brightness-0 invert" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Hunger Hive. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer