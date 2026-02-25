import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white border-t border-gray-900">
      {/* Newsletter Section */}
      <div className="border-b border-gray-900 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left max-w-xl">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-white">Unlock Exclusive Offers</h3>
              <p className="text-gray-400 text-lg">Subscribe to our newsletter and get 20% off your first premium delivery order.</p>
            </div>
            <form 
              className="w-full lg:w-auto flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative w-full sm:w-80">
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full h-14 pl-5 pr-4 rounded-xl bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                  required
                />
              </div>
              <Button 
                type="submit"
                size="lg"
                className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-1"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-gray-900 pb-16">
          
          {/* Logo and Description (Spans 4 cols on large screens) */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block">
              <img src={assets.HH_logo} alt="Hunger Hive" className="h-10 w-auto brightness-0 invert hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-gray-400 text-base leading-relaxed pr-4">
              Experience the finest cuisine delivered right to your doorstep. Your favorite food, delivered fresh, fast, and exactly how you crave it.
            </p>
            <div className="flex space-x-4">
              <a href="#app-store" aria-label="Download on App Store" className="block hover:-translate-y-1 transition-transform">
                <img src={assets.app_store} alt="" aria-hidden="true" className="h-10 cursor-pointer" />
              </a>
              <a href="#play-store" aria-label="Get it on Google Play" className="block hover:-translate-y-1 transition-transform">
                <img src={assets.play_store} alt="" aria-hidden="true" className="h-10 cursor-pointer" />
              </a>
            </div>
          </div>

          {/* Quick Links (Spans 2 cols) */}
          <nav className="lg:col-span-2" aria-label="Quick Links">
            <h3 className="text-lg font-bold text-white mb-6">Company</h3>
            <ul className="space-y-4">
              {['Home', 'Menu', 'Restaurants', 'Mobile App', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-gray-400 hover:text-orange-500 font-medium transition-colors inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info (Spans 3 cols) */}
          <address className="lg:col-span-3 not-italic">
            <h3 className="text-lg font-bold text-white mb-6">Get in Touch</h3>
            <ul className="space-y-5 text-gray-400">
              <li className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex flex-shrink-0 items-center justify-center text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="pt-2">123 Food Street, Downtown Culinary District, LA 90014</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex flex-shrink-0 items-center justify-center text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href="tel:+1234567890" className="hover:text-orange-500 transition-colors">+1 (234) 567-8900</a>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex flex-shrink-0 items-center justify-center text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href="mailto:support@hungerhive.com" className="hover:text-orange-500 transition-colors">support@hungerhive.com</a>
              </li>
            </ul>
          </address>

          {/* Social Links (Spans 3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-6">Follow Us</h3>
            <p className="text-gray-400 text-sm mb-6">Stay connected for exclusive behind-the-scenes and secret menu drops.</p>
            <div className="flex gap-4">
              <a href="#facebook" aria-label="Visit our Facebook page" className="w-12 h-12 bg-gray-900 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors group">
                <img src={assets.facebook_icon} alt="" aria-hidden="true" className="h-5 w-5 brightness-0 invert group-hover:scale-110 transition-transform" />
              </a>
              <a href="#twitter" aria-label="Visit our Twitter profile" className="w-12 h-12 bg-gray-900 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors group">
                <img src={assets.twitter_icon} alt="" aria-hidden="true" className="h-5 w-5 brightness-0 invert group-hover:scale-110 transition-transform" />
              </a>
              <a href="#linkedin" aria-label="Visit our LinkedIn page" className="w-12 h-12 bg-gray-900 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors group">
                <img src={assets.linkedin_icon} alt="" aria-hidden="true" className="h-5 w-5 brightness-0 invert group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} <span className="text-white">Hunger Hive</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-500 font-medium">
            <a href="#privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-orange-500 transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-orange-500 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;