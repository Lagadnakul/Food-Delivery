import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  User, 
  MessageSquare,
  Hash,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Lazy map — only embed iframe once the section is near the viewport
  const mapRef = useRef(null);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMapVisible(true); },
      { rootMargin: '200px' }
    );
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Replace with real API call (Resend / Formspree / EmailJS)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 4000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-orange-500 text-lg font-medium mb-2">Get In Touch</h3>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We'd Love To Hear From You
          </h1>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Have questions about our services or need assistance? Reach out to us and our dedicated team will be happy to help!
          </p>
        </div>
        
        {/* Contact Card */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="lg:flex">
              {/* Info panel */}
              <div className="lg:w-2/5 bg-gradient-to-br from-orange-500 to-orange-600 p-10 lg:p-12 text-white relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-orange-400 opacity-20" />
                <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-orange-400 opacity-20" />
                
                <h3 className="text-2xl font-semibold mb-8 relative z-10">Contact Information</h3>
                <div className="space-y-8 relative z-10">
                  {[
                    { Icon: MapPin,  label: 'Our Location', text: '123 Food Street, Los Angeles, CA 90001, USA' },
                    { Icon: Phone,   label: 'Call Us',      text: '+1 234 567 890' },
                    { Icon: Mail,    label: 'Email Us',     text: 'support@hungerhive.com' },
                  // eslint-disable-next-line no-unused-vars
                  ].map(({ Icon, label, text }) => (
                    <div key={label} className="flex items-start">
                      <div className="shrink-0 bg-orange-400/30 p-3 rounded-xl mr-4">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{label}</h4>
                        <p className="text-orange-100 mt-1">{text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start">
                    <div className="shrink-0 bg-orange-400/30 p-3 rounded-xl mr-4">
                      <Clock className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Working Hours</h4>
                      <p className="text-orange-100 mt-1">Mon – Fri: 9:00 AM – 10:00 PM</p>
                      <p className="text-orange-100">Weekends: 10:00 AM – 11:00 PM</p>
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="mt-14 relative z-10">
                  <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
                  <div className="flex space-x-4">
                    {[
                      { Icon: Facebook,  label: 'Facebook',  href: 'https://facebook.com' },
                      { Icon: Twitter,   label: 'Twitter',   href: 'https://twitter.com' },
                      { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
                      { Icon: Linkedin,  label: 'LinkedIn',  href: 'https://linkedin.com' },
                    // eslint-disable-next-line no-unused-vars
                    ].map(({ Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow us on ${label}`}
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white hover:text-orange-600 flex items-center justify-center transition-all transform hover:scale-110 shadow-sm"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:w-3/5 p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Send us a message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: 'name',  label: 'Your Name',  icon: User,         type: 'text',  placeholder: 'Enter your name' },
                      { id: 'email', label: 'Your Email', icon: Mail,         type: 'email', placeholder: 'Enter your email' },
                    // eslint-disable-next-line no-unused-vars
                    ].map(({ id, label, icon: Icon, type, placeholder }) => (
                      <div key={id}>
                        <label htmlFor={id} className="block text-gray-700 font-medium mb-2">{label}</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type={type}
                            id={id}
                            name={id}
                            value={formData[id]}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                            placeholder={placeholder}
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                    <div className="relative">
                      <div className="absolute top-3 left-4 flex items-start pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all shadow-sm"
                        placeholder="Write your message here…"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl
                        hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                        transition-all shadow-md flex items-center justify-center hover:-translate-y-0.5
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </button>

                    {submitStatus === 'success' && (
                      <div
                        role="status"
                        className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl flex items-center border border-green-200 animate-in fade-in slide-in-from-bottom-2 duration-300"
                      >
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0" aria-hidden="true" />
                        Your message has been sent! We'll get back to you soon.
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lazy-loaded Google Map */}
        <div ref={mapRef} className="rounded-3xl overflow-hidden shadow-xl mb-16">
          <div className="h-[500px] bg-gray-200 relative">
            {mapVisible ? (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27405770525!2d-118.69192047471653!3d34.02016130390376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1635835881961!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="HungerHive office location on Google Maps"
                className="absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <MapPin className="h-10 w-10" />
                  <span className="text-sm">Map loading…</span>
                </div>
              </div>
            )}

            {/* Location overlay card */}
            <div className="absolute top-8 left-8 bg-white p-6 rounded-2xl shadow-xl max-w-sm z-10">
              <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                <MapPin className="h-6 w-6 text-orange-500 mr-2" aria-hidden="true" />
                Our Main Office
              </h3>
              <p className="text-gray-600">123 Food Street, Los Angeles, CA 90001, USA</p>
              <div className="mt-4 flex">
                <a
                  href="https://maps.google.com/?q=Los+Angeles,CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                >
                  Get Directions
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h3 className="text-orange-500 text-lg font-medium mb-2">Frequently Asked Questions</h3>
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Got Questions? We've Got Answers</h2>
          
          <div className="space-y-6 text-left">
            {[
              {
                q: 'How do I place an order?',
                a: "You can place an order through our website or mobile app. Browse the menu, select your items, and proceed to checkout. You'll receive a confirmation once your order is placed.",
              },
              {
                q: "What's the minimum order value for free delivery?",
                a: 'Orders above $15 qualify for free delivery within our service areas. For orders below this amount, a small delivery fee will be applied at checkout.',
              },
              {
                q: 'How can I track my order?',
                a: "Once your order is confirmed, you can track it in real-time through our app or website. You'll receive updates via notifications and can see the exact location of your delivery person.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white p-6 rounded-2xl shadow-lg">
                <h4 className="font-semibold text-lg text-gray-900 mb-2">{q}</h4>
                <p className="text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;