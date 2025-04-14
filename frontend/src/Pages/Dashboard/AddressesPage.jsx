import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../config';
import { showToast } from '../../utils/toastUtils';
import { MapPin, Plus, Home, Briefcase, MoreHorizontal, Edit, Trash2, Check } from 'lucide-react';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    label: 'home',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAddresses(response.data.user.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      showToast.error('Failed to load your addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (editingAddress) {
        response = await axios.put(
          `${API_URL}/user/addresses/${editingAddress._id}`, 
          formData,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          `${API_URL}/user/addresses`, 
          formData,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      }
      
      if (response.data.success) {
        showToast.success(
          editingAddress 
            ? 'Address updated successfully' 
            : 'Address added successfully'
        );
        setAddresses(response.data.addresses);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showToast.error('Failed to save address');
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/user/addresses/${addressId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showToast.success('Address deleted successfully');
        setAddresses(response.data.addresses);
        setActiveDropdown(null);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      showToast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/user/addresses/${addressId}/default`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showToast.success('Default address updated');
        setAddresses(response.data.addresses);
        setActiveDropdown(null);
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      showToast.error('Failed to update default address');
    }
  };

  const editAddress = (address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      label: address.label,
      isDefault: address.isDefault
    });
    setEditingAddress(address);
    setShowForm(true);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      label: 'home',
      isDefault: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
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
        <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
        <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
      </div>
      
      <div className="p-6">
        {/* Address Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Type
                    </label>
                    <div className="flex space-x-4">
                      <label className={`flex-1 cursor-pointer flex items-center justify-center py-3 ${formData.label === 'home' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-gray-50 border-gray-200 text-gray-700'} border rounded-lg`}>
                        <input
                          type="radio"
                          name="label"
                          value="home"
                          checked={formData.label === 'home'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <Home size={18} className="mr-2" />
                        Home
                      </label>
                      
                      <label className={`flex-1 cursor-pointer flex items-center justify-center py-3 ${formData.label === 'work' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-gray-50 border-gray-200 text-gray-700'} border rounded-lg`}>
                        <input
                          type="radio"
                          name="label"
                          value="work"
                          checked={formData.label === 'work'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <Briefcase size={18} className="mr-2" />
                        Work
                      </label>
                      
                      <label className={`flex-1 cursor-pointer flex items-center justify-center py-3 ${formData.label === 'other' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-gray-50 border-gray-200 text-gray-700'} border rounded-lg`}>
                        <input
                          type="radio"
                          name="label"
                          value="other"
                          checked={formData.label === 'other'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <MapPin size={18} className="mr-2" />
                        Other
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Make this my default address</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Add Address Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-orange-200 hover:text-orange-500 transition-colors flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Address
          </button>
        )}
        
        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <MapPin className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">No addresses yet</h3>
            <p className="text-gray-500 mb-4">Add your first address to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        address.label === 'home' ? 'bg-blue-50 text-blue-600' :
                        address.label === 'work' ? 'bg-purple-50 text-purple-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {address.label === 'home' ? (
                          <Home size={16} />
                        ) : address.label === 'work' ? (
                          <Briefcase size={16} />
                        ) : (
                          <MapPin size={16} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 capitalize">
                          {address.label}
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 py-0.5 px-1.5 rounded">
                              Default
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(address._id)}
                        className="p-1.5 hover:bg-gray-100 rounded-full"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      {activeDropdown === address._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          ></div>
                          <div className="absolute right-0 mt-1 py-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                            <button
                              onClick={() => editAddress(address)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <Edit size={14} className="mr-2" />
                              Edit
                            </button>
                            
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefault(address._id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Check size={14} className="mr-2" />
                                Set as Default
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDelete(address._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-800 font-medium">{address.name}</p>
                    <p className="text-gray-600">{address.address}</p>
                    <p className="text-gray-600">{address.phone}</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => editAddress(address)}
                      className="text-orange-500 hover:underline text-sm flex items-center"
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;