import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon, 
  PaperAirplaneIcon, 
  UserIcon, 
  ChatBubbleLeftEllipsisIcon,
  HashtagIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }, 1500);
  };
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16">
        <motion.div 
          {...fadeIn} 
          className="text-center mb-16"
        >
          <h3 className="text-orange-500 text-lg font-medium mb-2">Get In Touch</h3>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We'd Love To Hear From You
          </h1>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Have questions about our services or need assistance? Reach out to us and our dedicated team will be happy to help!
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="lg:flex">
              {/* Contact Info Section */}
              <div className="lg:w-2/5 bg-gradient-to-br from-orange-500 to-orange-600 p-10 lg:p-12 text-white relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-orange-400 opacity-20"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-orange-400 opacity-20"></div>
                
                <h3 className="text-2xl font-semibold mb-8 relative z-10">Contact Information</h3>
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start">
                    <div className="shrink-0 bg-orange-400 bg-opacity-30 p-3 rounded-xl mr-4">
                      <MapPinIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Our Location</h4>
                      <p className="text-orange-100 mt-1">123 Food Street, Los Angeles, CA 90001, USA</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="shrink-0 bg-orange-400 bg-opacity-30 p-3 rounded-xl mr-4">
                      <PhoneIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Call Us</h4>
                      <p className="text-orange-100 mt-1">+1 234 567 890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="shrink-0 bg-orange-400 bg-opacity-30 p-3 rounded-xl mr-4">
                      <EnvelopeIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Email Us</h4>
                      <p className="text-orange-100 mt-1">support@hungerhive.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="shrink-0 bg-orange-400 bg-opacity-30 p-3 rounded-xl mr-4">
                      <ClockIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Working Hours</h4>
                      <p className="text-orange-100 mt-1">Monday - Friday: 9:00 AM - 10:00 PM</p>
                      <p className="text-orange-100">Weekends: 10:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-14 relative z-10">
                  <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
                  <div className="flex space-x-4">
                    {/* Social icons - keeping as SVGs since they're specific brand icons not in Heroicons */}
                    <a href="#" className="w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-100 hover:text-orange-600 flex items-center justify-center transition-all transform hover:scale-110 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-100 hover:text-orange-600 flex items-center justify-center transition-all transform hover:scale-110 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-100 hover:text-orange-600 flex items-center justify-center transition-all transform hover:scale-110 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-100 hover:text-orange-600 flex items-center justify-center transition-all transform hover:scale-110 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:w-3/5 p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Send us a message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Your Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Your Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                      Subject
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HashtagIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                        placeholder="Enter message subject"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Your Message
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-4 flex items-start pointer-events-none">
                        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all shadow-sm"
                        placeholder="Write your message here..."
                        required
                      ></textarea>
                    </div>
                  </div>
                  
                  <div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl 
                                hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                                transition-all shadow-md flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                    
                    <AnimatePresence>
                      {submitStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl flex items-center border border-green-200"
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                          Your message has been sent successfully! We'll get back to you soon.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="rounded-3xl overflow-hidden shadow-xl mb-16"
        >
          <div className="h-[500px] bg-gray-200 relative">
            {/* Google Map iframe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27405770525!2d-118.69192047471653!3d34.02016130390376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1635835881961!5m2!1sen!2sin"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Google Map"
              className="absolute inset-0"
            ></iframe>
            
            {/* Location card overlay */}
            <div className="absolute top-8 left-8 bg-white p-6 rounded-2xl shadow-xl max-w-sm">
              <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                <MapPinIcon className="h-6 w-6 text-orange-500 mr-2" />
                Our Main Office
              </h3>
              <p className="text-gray-600">123 Food Street, Los Angeles, CA 90001, USA</p>
              <div className="mt-4 flex">
                <a href="#" className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                  Get Directions
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h3 className="text-orange-500 text-lg font-medium mb-2">Frequently Asked Questions</h3>
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Got Questions? We've Got Answers</h2>
          
          <div className="space-y-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">How do I place an order?</h4>
              <p className="text-gray-600">You can place an order through our website or mobile app. Browse the menu, select your items, and proceed to checkout. You'll receive a confirmation once your order is placed.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">What's the minimum order value for free delivery?</h4>
              <p className="text-gray-600">Orders above $15 qualify for free delivery within our service areas. For orders below this amount, a small delivery fee will be applied at checkout.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">How can I track my order?</h4>
              <p className="text-gray-600">Once your order is confirmed, you can track it in real-time through our app or website. You'll receive updates via notifications and can see the exact location of your delivery person.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;