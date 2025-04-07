import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Add = () => {
  const url = "http://localhost:4000/api";
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Salad",
    price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!image) {
        toast.error("Please select an image");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("image", image);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);

      console.log("Sending data:", formData, image.name);

      // Make sure the URL is correct
      const apiUrl = `${url}/food/add`;
      console.log("API URL:", apiUrl);

      // Set a longer timeout for the request
      const response = await axios.post(apiUrl, data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 15000 // 15 seconds
      });

      if (response.data.success) {
        toast.success("Food item added successfully!");
        console.log("Added item:", response.data.data);
        
        // Reset form
        setImage(false);
        setFormData({
          name: "",
          description: "",
          category: "Salad",
          price: "",
        });
      } else {
        toast.error(`Error: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding food:", error);
      
      // More detailed error handling
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error: Check if your backend server is running at http://localhost:4000");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timed out. Server may be slow to respond.");
      } else if (error.response) {
        toast.error(`Server error: ${error.response.data.message || error.response.statusText}`);
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("image/")) {
        setImage(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const handleImageSelection = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
    
  };

  return (
    <div className="flex justify-center items-center w-full">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
      />
      
      <div className="max-w-md w-full mx-auto">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Add New Food Item</h1>
          <p className="text-gray-500 mt-2">Complete the form below to add a new item to your menu</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2"></div>
          
          <form onSubmit={handleSubmit} className="p-8">
            {/* Image Upload - Made smaller */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Upload Image</h3>
              
              <div 
                className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition
                  ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-200'} 
                  ${image ? 'bg-gray-50' : 'hover:bg-gray-50 hover:border-gray-300'}`
                }
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <label htmlFor="image-upload" className="w-full cursor-pointer">
                  {image ? (
                    <div className="relative group">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt="Food preview"
                        className="w-full h-36 object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                        <p className="text-white font-medium">Change image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 bg-orange-100 rounded-full mb-2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-600">Drop your image here, or <span className="text-orange-500">browse</span></p>
                      <p className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, WEBP</p>
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
            
            {/* Name Field - Increased spacing */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Food Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Chicken Caesar Salad"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            {/* Description Field - Increased spacing */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe your food item"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                required
              />
            </div>

            {/* Category Field - Increased spacing */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                  required
                >
                  <option value="Salad">Salad</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Deserts">Deserts</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Noodles">Noodles</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Price Field - Increased spacing */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>
            
            {/* Footer with Submit Button - Centered */}
            <div className="pt-4 border-t border-gray-200 flex justify-center">
              <div className="flex gap-4 w-full">
                <button
                  type="button"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setImage(false);
                    setFormData({
                      name: "",
                      description: "",
                      category: "Salad",
                      price: "",
                    });
                  }}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium flex items-center justify-center
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-md
                    hover:from-orange-600 hover:to-orange-700 transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
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
                      Adding...
                    </>
                  ) : (
                    <>
                      Add Item
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;