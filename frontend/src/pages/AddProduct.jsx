import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';
import { FiUpload, FiDollarSign, FiCalendar, FiPhone, FiMapPin, FiBox, FiX, FiList } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { useMediaQuery } from 'react-responsive';
import MyProducts from './MyProducts';
import { Switch } from '@headlessui/react';

const AddProduct = () => {
  const { token } = useAuthStore();
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [showProducts, setShowProducts] = useState(false);


  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },[]);

  const [form, setForm] = useState({
    productName: '',
    description: '',
    price: '',
    address: '',
    mobile: '',
    purchaseDate: '',
    city: '',
    category: ''
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Books', label: 'Books' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Others', label: 'Others' }
  ];

  const imagePreviews = useMemo(() => {
    return files.map(file => {
      try {
        return URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating object URL:', error);
        return '';
      }
    }).filter(url => url !== '');
  }, [files]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (selectedOption) => {
    setForm({ ...form, category: selectedOption.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeImage = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }
      for (let file of files) {
        formData.append('images', file);
      }

      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Product listed successfully!', {
        style: {
          background: '#4f46e5',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#4f46e5',
        },
      });
      
      setForm({
        productName: '',
        description: '',
        price: '',
        address: '',
        mobile: '',
        purchaseDate: '',
        city: '',
        category: ''
      });
      setFiles([]);
      setShowProducts(true);
    } catch (err) {
      console.error('Product listing failed:', err);
      toast.error(err.response?.data?.message || 'Something went wrong!', {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4"
    >
      <div className={`mx-auto ${isDesktop ? 'max-w-5xl' : 'max-w-md'}`}>
        {/* Improved Toggle Switch */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-white rounded-full shadow-md p-1 border border-gray-200">
            <button
              onClick={() => setShowProducts(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!showProducts ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center">
                <FiBox className="mr-2" />
                Add Product
              </div>
            </button>
            <button
              onClick={() => setShowProducts(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${showProducts ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center">
                <FiList className="mr-2" />
                My Products
              </div>
            </button>
          </div>
        </div>

        {showProducts ? (
          <MyProducts />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-purple-100"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2">List New Product</h2>
            <p className="text-gray-600 mb-6">Fill in the details to list your product</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isDesktop ? (
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="relative">
                      <FiBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                      <input
                        name="productName"
                        placeholder="Product Name"
                        value={form.productName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                      <input
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <Select
                        options={categoryOptions}
                        onChange={handleCategoryChange}
                        placeholder="Select Category"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        required
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <textarea
                        name="description"
                        placeholder="Product Description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      ></textarea>
                    </div>
                    <div>
                      <label className='text-gray-500'>Select Item Purchased Date</label>
                    </div>

                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                      <input
                        type="date"
                        name="purchaseDate"
                        value={form.purchaseDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>

                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                      <input
                        name="mobile"
                        placeholder="Contact Mobile Number"
                        value={form.mobile}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-gray-700">
                        <FiUpload className="text-indigo-500" />
                        <span>Product Images</span>
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                      
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={preview} 
                                alt={`Preview ${index}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <FiBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                    <input
                      name="productName"
                      placeholder="Product Name"
                      value={form.productName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>

                  <div>
                    <textarea
                      name="description"
                      placeholder="Product Description"
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                    </div>

                    <label className='text-gray-500'>Select Item Purchased Date</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                      <input
                        type="date"
                        name="purchaseDate"
                        value={form.purchaseDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                    <input
                      name="address"
                      placeholder="Your Full Address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                      <input
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                      <input
                        name="mobile"
                        placeholder="Contact Mobile Number"
                        value={form.mobile}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Select
                      options={categoryOptions}
                      onChange={handleCategoryChange}
                      placeholder="Select Category"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-gray-700">
                      <FiUpload className="text-indigo-500" />
                      <span>Product Images</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                    
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={preview} 
                              alt={`Preview ${index}`}
                              className="w-full h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isDesktop ? 'Listing Product...' : 'Processing...'}
                  </span>
                ) : (
                  'List Product'
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AddProduct;