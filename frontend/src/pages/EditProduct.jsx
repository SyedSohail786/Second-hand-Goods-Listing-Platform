import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
     FiEdit2, FiTrash2, FiImage, FiUpload, FiDollarSign, FiCalendar,
     FiPhone, FiMapPin, FiBox, FiX, FiArrowLeft
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
const backend = import.meta.env.VITE_BACKEND_URI;

const EditProduct = () => {
     const { id } = useParams();
     const { token } = useAuthStore();
     const navigate = useNavigate();
     const isMobile = useMediaQuery({ maxWidth: 640 });

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

     const [images, setImages] = useState([]);
     const [existingImages, setExistingImages] = useState([]);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [imagePreviews, setImagePreviews] = useState([]);

     const categories = [
          'Electronics', 'Furniture', 'Books', 'Clothing', 'Others'
     ];

     useEffect(() => {
          window.scrollTo({
               top: 0,
               behavior: 'smooth'
          });
     }, []);


     const fetchProduct = async () => {
          try {
               const res = await axios.get(`${backend}/api/products/${id}`);
               const product = res.data;
               setForm({
                    productName: product.productName || '',
                    description: product.description || '',
                    price: product.price || '',
                    address: product.address || '',
                    mobile: product.mobile || '',
                    purchaseDate: product.purchaseDate?.split('T')[0] || '',
                    city: product.city || '',
                    category: product.category || ''
               });
               setExistingImages(product.images || []);
          } catch (err) {
               console.error('Error fetching product:', err);
               toast.error('Failed to load product details');
          }
     };

     const handleChange = (e) => {
          setForm({ ...form, [e.target.name]: e.target.value });
     };

     const handleFileChange = (e) => {
          const selectedFiles = Array.from(e.target.files);
          setImages(selectedFiles);

          // Create previews for new images
          const previews = selectedFiles.map(file => URL.createObjectURL(file));
          setImagePreviews(previews);
     };

     const removeExistingImage = async (imagePath) => {
          if (window.confirm('Are you sure you want to remove this image?')) {
               try {
                    await axios.delete(`${backend}/api/products/${id}/images`, {
                         headers: {
                              Authorization: `Bearer ${token}`
                         },
                         data: { imagePath }
                    });
                    setExistingImages(existingImages.filter(img => img !== imagePath));
                    toast.success('Image removed successfully');
               } catch (err) {
                    console.error('Error removing image:', err);
                    toast.error('Failed to remove image');
               }
          }
     };

     const removeNewImage = (index) => {
          const newImages = [...images];
          newImages.splice(index, 1);
          setImages(newImages);

          const newPreviews = [...imagePreviews];
          URL.revokeObjectURL(newPreviews[index]);
          newPreviews.splice(index, 1);
          setImagePreviews(newPreviews);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setIsSubmitting(true);

          try {
               const formData = new FormData();
               for (let key in form) {
                    formData.append(key, form[key]);
               }
               for (let file of images) {
                    formData.append('images', file);
               }

               await axios.put(`${backend}/api/products/${id}`, formData, {
                    headers: {
                         Authorization: `Bearer ${token}`,
                         'Content-Type': 'multipart/form-data'
                    }
               });

               toast.success('Product updated successfully!');
               navigate('/add-product');
          } catch (err) {
               console.error('Update error:', err.response?.data || err.message);
               toast.error(err.response?.data?.message || 'Failed to update product');
          } finally {
               setIsSubmitting(false);
          }
     };

     const handleCancel = () => {
          if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
               navigate('/add-product');
          }
     };

     useEffect(() => {
          fetchProduct();

          // Clean up object URLs when component unmounts
          return () => {
               imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
          };
     }, [id]);

     return (
          <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.3 }}
               className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4"
          >
               <div className={`mx-auto ${isMobile ? 'max-w-md' : 'max-w-2xl'}`}>
                    <div className="flex items-center mb-6">
                         {/* <button 
                        onClick={handleCancel}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
                    >
                        <FiArrowLeft className="mr-1" />
                        Back
                    </button> */}
                         <h2 className="text-2xl font-bold text-indigo-900">Edit Product</h2>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                         <form onSubmit={handleSubmit} className="space-y-6">
                              <div className={isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-6'}>
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
                                             <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                             <select
                                                  name="category"
                                                  value={form.category}
                                                  onChange={handleChange}
                                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                  required
                                             >
                                                  <option value="">Select Category</option>
                                                  {categories.map(category => (
                                                       <option key={category} value={category}>{category}</option>
                                                  ))}
                                             </select>
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
                                                  placeholder="Contact Number"
                                                  value={form.mobile}
                                                  onChange={handleChange}
                                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                             />
                                        </div>

                                        <div className="relative">
                                             <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                                             <input
                                                  name="address"
                                                  placeholder="Full Address"
                                                  value={form.address}
                                                  onChange={handleChange}
                                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* Image Upload Section */}
                              <div className="space-y-4">
                                   <div className="space-y-2">
                                        <label className="flex items-center space-x-2 text-gray-700">
                                             <FiUpload className="text-indigo-500" />
                                             <span>Upload New Images</span>
                                        </label>
                                        <input
                                             type="file"
                                             multiple
                                             onChange={handleFileChange}
                                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />

                                        {/* New Image Previews */}
                                        {imagePreviews.length > 0 && (
                                             <div className="grid grid-cols-3 gap-2 mt-2">
                                                  {imagePreviews.map((preview, index) => (
                                                       <div key={index} className="relative group">
                                                            <img
                                                                 src={preview}
                                                                 alt={`Preview ${index}`}
                                                                 className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                            />
                                                            <button
                                                                 type="button"
                                                                 onClick={() => removeNewImage(index)}
                                                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                 <FiX size={14} />
                                                            </button>
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
                                   </div>

                                   {/* Existing Images */}
                                   {existingImages.length > 0 && (
                                        <div>
                                             <label className="flex items-center space-x-2 text-gray-700 mb-2">
                                                  <FiImage className="text-indigo-500" />
                                                  <span>Existing Images</span>
                                             </label>
                                             <div className="grid grid-cols-3 gap-2">
                                                  {existingImages.map((img, index) => (
                                                       <div key={index} className="relative group">
                                                            <img
                                                                 src={`${backend}${img}`}
                                                                 alt={`Existing ${index}`}
                                                                 className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                            />
                                                            <button
                                                                 type="button"
                                                                 onClick={() => removeExistingImage(img)}
                                                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                 <FiX size={14} />
                                                            </button>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   )}
                              </div>

                              {/* Form Actions */}
                              <div className="flex justify-end space-x-4 pt-4">
                                   <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-2 border text-sm border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                   >
                                        Cancel
                                   </button>
                                   <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isSubmitting}
                                        className={`px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                   >
                                        {isSubmitting ? (
                                             <>
                                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                  </svg>
                                                  Updating...
                                             </>
                                        ) : (
                                             <>
                                                  <FiEdit2 className="mr-2" />
                                                  Update Product
                                             </>
                                        )}
                                   </motion.button>
                              </div>
                         </form>
                    </div>
               </div>
          </motion.div>
     );
};

export default EditProduct;