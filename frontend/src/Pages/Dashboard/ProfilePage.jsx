import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { showToast } from '../../utils/toastUtils';
import { User, Mail, Phone } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          phone: response.data.user.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast.error('Failed to load your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/user/profile`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        showToast.success('Profile updated successfully');
        setEditing(false);
        
        // Update local storage user data
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          localStorage.setItem('user', JSON.stringify({
            ...storedUser,
            name: formData.name,
            phone: formData.phone
          }));
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast.error('Failed to update your profile');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-1">View and edit your personal information</p>
      </div>
      
      <div className="p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Mail size={14} className="mr-1" />
                  {user.email}
                </p>
                {user.phone && (
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Phone size={14} className="mr-1" />
                    {user.phone}
                  </p>
                )}
              </div>
            </div>
            
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2.5 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;