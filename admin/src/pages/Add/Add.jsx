import React, { useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { addFood } from '../../services/foodService';

const Add = () => {
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Salad",
    price: "",
  });

  // Categories list for better maintenance
  const categories = [
    "Salad", "Rolls", "Deserts", "Sandwich", 
    "Cake", "Pure Veg", "Pasta", "Noodles"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!image) {
        toast.warning("Please select an image for your food item", {
          icon: "🖼️"
        });
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("image", image);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);

      const result = await addFood(data);

      if (result.success) {
        toast.success("Food item added successfully! 🍔");
        resetForm();
      } else {
        toast.error(result.message || "Failed to add food item");
      }
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error(error.message || "Failed to add food item. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setImage(null);
    setPreviewUrl('');
    setFormData({
      name: "",
      description: "",
      category: "Salad",
      price: "",
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFileSelection = useCallback((file) => {
    if (file.type.includes("image/")) {
      setImage(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      toast.error("Please upload a valid image file (JPG, PNG, etc.)");
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, [handleFileSelection]);

  const handleImageSelection = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  }, [handleFileSelection]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-50 p-6 rounded-2xl">
      
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Food Item</h1>
        <p className="text-gray-600">Complete the form below to add a delicious item to your menu</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2"></div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Image <span className="text-red-500">*</span>
              </label>
              <div 
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 h-64 transition
                  ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-200'} 
                  ${image ? 'bg-gray-50' : 'hover:bg-gray-50 hover:border-gray-300'}`
                }
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <label htmlFor="image-upload" className="w-full h-full cursor-pointer">
                  {previewUrl ? (
                    <div className="relative group h-full">
                      <img 
                        src={previewUrl}
                        alt="Food preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                        <p className="text-white font-medium px-4 py-2 bg-orange-500 rounded-lg">Change image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full mb-3 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-md font-medium text-gray-700">Drop image here, or <span className="text-orange-500">browse</span></p>
                      <p className="text-sm text-gray-500 mt-1">Supports: JPG, PNG, WEBP</p>
                    </div>
                  )}
                </label>
                <input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelection} 
                  className="hidden" 
                />
              </div>
            </div>
            
            {/* Form Fields Section */}
            <div className="md:col-span-1 space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="food-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="food-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Chicken Caesar Salad"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  required
                />
              </div>

              {/* Price Field */}
              <div>
                <label htmlFor="food-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    id="food-price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Category Field */}
              <div>
                <label htmlFor="food-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="food-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none shadow-sm"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description Field - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="food-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="food-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe your food item in detail. Include key ingredients and any special preparation methods."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none shadow-sm"
                required
              />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg
                shadow-md hover:shadow-lg transition-all flex items-center justify-center
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-orange-600 hover:to-orange-700"}`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Item...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Food Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;