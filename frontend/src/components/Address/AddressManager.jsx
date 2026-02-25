import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence , motion } from 'framer-motion';
import { showToast } from '../../utils/toastUtils';
import axios from 'axios';
import { API_URL } from '../../config';
import { 
  Home, 
  Briefcase, 
  Map,
  Phone, 
  User, 
  Tag, 
  Edit, 
  Trash, 
  Plus,
  CheckCircle,
  AlertTriangle,
  Loader
} from 'lucide-react';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
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
      
      if (response.data.success && response.data.user) {
        setAddresses(response.data.user.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      showToast.error('Failed to load your saved addresses');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/user/addresses`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setAddresses(response.data.addresses);
        showToast.success('Address added successfully', { icon: '🏠' });
        resetForm();
      }
    } catch (error) {
      console.error('Error adding address:', error);
      showToast.error(error.response?.data?.message || 'Failed to add address');
    }
  };

  const updateAddress = async () => {
    if (!editingAddress) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/user/addresses/${editingAddress}`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setAddresses(response.data.addresses);
        showToast.success('Address updated successfully', { icon: '✅' });
        resetForm();
      }
    } catch (error) {
      console.error('Error updating address:', error);
      showToast.error(error.response?.data?.message || 'Failed to update address');
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/user/addresses/${addressId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setAddresses(response.data.addresses);
        showToast.info('Address deleted', { icon: '🗑️' });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      showToast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/user/addresses/${addressId}/default`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setAddresses(response.data.addresses);
        showToast.success('Default address updated', { icon: '📍' });
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      showToast.error(error.response?.data?.message || 'Failed to update default address');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress();
    } else {
      addAddress();
    }
  };

  const handleEdit = (address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      label: address.label || 'home',
      isDefault: address.isDefault
    });
    setEditingAddress(address._id);
    setShowAddForm(true);
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
    setShowAddForm(false);
  };

  const getLabelIcon = (label) => {
    switch(label) {
      case 'home': return <Home size={16} />;
      case 'work': return <Briefcase size={16} />;
      default: return <Map size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="animate-spin text-orange-500 mr-2" size={24} />
        <span className="text-gray-600">Loading addresses...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-4 py-2 rounded-lg flex items-center 
            ${showAddForm ? 'bg-gray-200 text-gray-800' : 'bg-orange-500 text-white hover:bg-orange-600'} 
            transition-colors`}
        >
          {showAddForm ? (
            <>Cancel</>
          ) : (
            <><Plus size={18} className="mr-1" /> Add New Address</>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="+1 234 567 890"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <Map size={16} className="text-gray-400" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                      placeholder="Enter your full address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-gray-400" />
                    </div>
                    <select
                      name="label"
                      value={formData.label}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
          <p className="text-gray-600 mb-6">You haven't added any delivery addresses yet.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 inline-flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <motion.div
              key={address._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow
                ${address.isDefault ? 'border-2 border-orange-500' : ''}`}
            >
              {address.isDefault && (
                <div className="absolute -top-3 -right-3 bg-orange-500 text-white rounded-full p-1">
                  <CheckCircle size={20} />
                </div>
              )}
              
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-2">
                  {getLabelIcon(address.label)}
                </div>
                <div>
                  <span className="text-sm font-medium capitalize text-gray-700">
                    {address.label}
                  </span>
                  {address.isDefault && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-600 py-0.5 px-2 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="font-bold text-gray-800">{address.name}</h3>
              <p className="text-gray-600 mt-1">{address.address}</p>
              <p className="text-gray-600 text-sm mt-2">Phone: {address.phone}</p>
              
              <div className="mt-4 pt-3 border-t flex justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit address"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteAddress(address._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete address"
                  >
                    <Trash size={16} />
                  </button>
                </div>
                
                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(address._id)}
                    className="text-sm text-orange-500 hover:text-orange-600 hover:underline"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManager;