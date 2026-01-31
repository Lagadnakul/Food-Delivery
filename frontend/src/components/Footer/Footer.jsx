import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Subscribe to our newsletter for exclusive offers and updates</p>
            </div>
            <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-5 py-3 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 w-full sm:w-80"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-medium transition-all transform hover:scale-105">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link to="/" className="block mb-4">
              <img src={assets.HH_logo} alt="Hunger Hive" className="h-12 w-auto brightness-0 invert hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the finest cuisine delivered right to your doorstep. Your favorite food, delivered fresh & fast.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="transform hover:scale-105 transition-transform">
                <img src={assets.app_store} alt="App Store" className="h-10 cursor-pointer hover:opacity-80 transition-opacity" />
              </a>
              <a href="#" className="transform hover:scale-105 transition-transform">
                <img src={assets.play_store} alt="Play Store" className="h-10 cursor-pointer hover:opacity-80 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute left-0 -bottom-2 w-12 h-1 bg-orange-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Home
              </Link></li>
              <li><Link to="/menu" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Menu
              </Link></li>
              <li><Link to="/restaurants" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Restaurants
              </Link></li>
              <li><Link to="/mobile-app" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Mobile App
              </Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Contact Us
              </Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Contact Us
              <span className="absolute left-0 -bottom-2 w-12 h-1 bg-orange-500 rounded-full"></span>
            </h3>
            <ul className="space-y-5 text-gray-400">
              <li className="flex items-start space-x-3 group hover:text-orange-500 cursor-pointer transition-colors">
                <span className="bg-gray-800 p-2 rounded-full group-hover:bg-orange-500 transition-colors mt-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="pt-1">123 Food Street, LA, USA</span>
              </li>
              <li className="flex items-start space-x-3 group hover:text-orange-500 cursor-pointer transition-colors">
                <span className="bg-gray-800 p-2 rounded-full group-hover:bg-orange-500 transition-colors mt-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <span className="pt-1">+1 234 567 890</span>
              </li>
              <li className="flex items-start space-x-3 group hover:text-orange-500 cursor-pointer transition-colors">
                <span className="bg-gray-800 p-2 rounded-full group-hover:bg-orange-500 transition-colors mt-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="pt-1">support@hungerhive.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Connect With Us
              <span className="absolute left-0 -bottom-2 w-12 h-1 bg-orange-500 rounded-full"></span>
            </h3>
            <div className="mb-6">
              <p className="text-gray-400 mb-4">Follow us on social media for special offers and updates</p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors transform hover:scale-110">
                  <img src={assets.facebook_icon} alt="Facebook" className="h-5 w-5 brightness-0 invert" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors transform hover:scale-110">
                  <img src={assets.twitter_icon} alt="Twitter" className="h-5 w-5 brightness-0 invert" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors transform hover:scale-110">
                  <img src={assets.linkedin_icon} alt="LinkedIn" className="h-5 w-5 brightness-0 invert" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors transform hover:scale-110">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-300">Download Our App</h4>
              <div className="flex gap-3">
                <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09998 22C7.78998 22.05 6.79998 20.68 5.95998 19.47C4.24998 17 2.93998 12.45 4.69998 9.39C5.56998 7.87 7.12998 6.91 8.81998 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.35 4.26 13 3.5Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </div>
                <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M3.17999 4.5V19.5C3.17999 20.11 3.54999 20.64 4.10999 20.86L12.12 9.5L4.10999 3.14C3.54999 3.36 3.17999 3.89 3.17999 4.5Z" fill="currentColor"/>
                    <path d="M20.82 12.5C20.82 11.92 20.56 11.36 20.12 10.93L18.18 9L5.82001 22L16.07 17C16.56 16.77 20.82 14.68 20.82 12.5Z" fill="currentColor"/>
                    <path d="M20.12 14.07L16.07 12L4.10999 20.86C4.33999 21.04 4.61999 21.14 4.89999 21.14C5.16999 21.14 5.44999 21.05 5.67999 20.87L18.18 15L20.12 14.07Z" fill="currentColor"/>
                    <path d="M16.07 12L20.12 10.93C20.56 10.5 20.82 9.94 20.82 9.36C20.82 7.18 16.56 5.09 16.07 4.86L5.82001 0L18.18 13L16.07 12Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} <span className="text-orange-500">Hunger Hive</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Cookie Settings</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;