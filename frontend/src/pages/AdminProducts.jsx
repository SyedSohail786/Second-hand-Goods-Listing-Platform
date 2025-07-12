import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { FiEdit, FiTrash2, FiUser, FiPhone, FiMapPin, FiDollarSign, FiCalendar, FiBox, FiX, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { useMediaQuery } from 'react-responsive';
const backend = import.meta.env.VITE_BACKEND_URI;

const AdminProducts = () => {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    description: '',
    price: '',
    address: '',
    mobile: '',
    purchaseDate: '',
    city: '',
    category: '',
    sellerId: '',
    images: []
  });

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },[]);

  
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  };

  const categoryOptions = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Books', label: 'Books' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Others', label: 'Others' }
  ];

  const imagePreviews = useMemo(() => {
    return form.images.length > 0 
      ? Array.from(form.images).map(file => URL.createObjectURL(file))
      : [];
  }, [form.images]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backend}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCategoryChange = (selectedOption) => {
    setForm({ ...form, category: selectedOption.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, images: e.target.files });
  };

  const removeImage = (index) => {
    const newFiles = [...form.images];
    newFiles.splice(index, 1);
    setForm({ ...form, images: newFiles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) {
      if (key === 'images') {
        for (let i = 0; i < form.images.length; i++) {
          data.append('images', form.images[i]);
        }
      } else {
        data.append(key, form[key]);
      }
    }

    try {
      if (editId) {
        await axios.put(`${backend}/api/admin/products/${editId}`, data, { headers });
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${backend}/api/admin/products`, data, { headers });
        toast.success('Product added successfully');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setForm({
      productName: '',
      description: '',
      price: '',
      address: '',
      mobile: '',
      purchaseDate: '',
      city: '',
      category: '',
      sellerId: '',
      images: []
    });
    setEditId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (product) => {
    setForm({
      productName: product.productName,
      description: product.description,
      price: product.price,
      address: product.address,
      mobile: product.mobile,
      purchaseDate: product.purchaseDate?.split('T')[0],
      city: product.city || '',
      category: product.category || '',
      sellerId: product.seller?._id || '',
      images: []
    });
    setEditId(product._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${backend}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
          >
            Add Product
          </button>
        </div>

        {/* Product Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {editId ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button 
                      onClick={resetForm} 
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className={isDesktop ? "grid grid-cols-2 gap-6" : "space-y-4"}>
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="relative">
                          <FiBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            name="productName"
                            placeholder="Product Name"
                            value={form.productName}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>

                        <div className="relative">
                          <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>

                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            name="city"
                            placeholder="City"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <Select
                            options={categoryOptions}
                            value={categoryOptions.find(opt => opt.value === form.category)}
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
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            rows={isDesktop ? "7" : "3"}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            name="purchaseDate"
                            value={form.purchaseDate}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            name="sellerId"
                            placeholder="Seller ID"
                            value={form.sellerId}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          
                          {/* Image Previews */}
                          {imagePreviews.length > 0 && (
                            <div className={`grid ${isDesktop ? 'grid-cols-4' : 'grid-cols-3'} gap-2 mt-2`}>
                              {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                  <img 
                                    src={preview} 
                                    alt={`Preview ${index}`}
                                    className={`w-full ${isDesktop ? 'h-28' : 'h-20'} object-cover rounded-lg border border-gray-200`}
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

                    <div className="flex justify-end space-x-3 pt-6">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {editId ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {product.category || 'Uncategorized'}
                  </span>
                </div>

                <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FiDollarSign className="mr-2 text-indigo-500" />
                    <span className="font-medium">₹{product.price}</span>
                  </div>

                  {product.city && (
                    <div className="flex items-center text-gray-700">
                      <FiMapPin className="mr-2 text-indigo-500" />
                      <span>{product.city}</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-700">
                    <FiUser className="mr-2 text-indigo-500" />
                    <div>
                      <p className="font-medium">{product.seller?.name}</p>
                      <p className="text-sm text-gray-500">{product.seller?.email}</p>
                    </div>
                  </div>

                  {product.buyer && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">Buyer Information:</p>
                      <div className="flex items-center mt-1 text-gray-700">
                        <FiUser className="mr-2 text-indigo-500" />
                        <span>{product.buyer.name}</span>
                      </div>
                      <div className="flex items-center mt-1 text-gray-700">
                        <FiPhone className="mr-2 text-indigo-500" />
                        <span>{product.buyer.phone}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;