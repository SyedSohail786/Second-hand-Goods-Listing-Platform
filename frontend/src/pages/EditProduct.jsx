import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const EditProduct = () => {
     const { id } = useParams();
     const { token } = useAuthStore();
     const navigate = useNavigate();

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

     const fetchProduct = async () => {
          try {
               const res = await axios.get(`http://localhost:5000/api/products/${id}`);
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
          }
     };

     const handleChange = (e) => {
          setForm({ ...form, [e.target.name]: e.target.value });
     };

     const handleFileChange = (e) => {
          setImages(e.target.files);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          try {
               const formData = new FormData();
               for (let key in form) {
                    formData.append(key, form[key]);
               }
               for (let file of images) {
                    formData.append('images', file);
               }

               await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
                    headers: {
                         Authorization: `Bearer ${token}`,
                         'Content-Type': 'multipart/form-data'
                    }
               });

               alert('Product updated successfully!');
               navigate('/my-products');
          } catch (err) {
               console.error('Update error:', err.response?.data || err.message);
          }
     };

     useEffect(() => {
          fetchProduct();
     }, [id]);

     return (
          <div className="max-w-2xl mx-auto p-6">
               <h2 className="text-2xl font-bold text-purple-800 mb-6">Edit Product</h2>

               <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
                    <input
                         type="text"
                         name="productName"
                         placeholder="Product Name"
                         value={form.productName}
                         onChange={handleChange}
                         className="w-full p-2 border rounded"
                         required
                    />
                    <textarea
                         name="description"
                         placeholder="Description"
                         value={form.description}
                         onChange={handleChange}
                         className="w-full p-2 border rounded"
                    ></textarea>
                    <input
                         type="number"
                         name="price"
                         placeholder="Price"
                         value={form.price}
                         onChange={handleChange}
                         className="w-full p-2 border rounded"
                         required
                    />
                    <input
                         type="text"
                         name="address"
                         placeholder="Full Address"
                         value={form.address}
                         onChange={handleChange}
                         className="w-full p-2 border rounded"
                    />
                    <input
                         type="text"
                         name="mobile"
                         placeholder="Mobile"
                         value={form.mobile}
                         onChange={handleChange}
                         className="w-full p-2 border rounded"
                    />
                    <input
                         type="date"
                         name="purchaseDate"
                         value={form.purchaseDate}
                         onChange={handleChange}
                         className="w-full p-2 border rounded"
                    />
                    <input
                         name="city"
                         placeholder="City"
                         value={form.city}
                         onChange={handleChange}
                         className="w-full p-2 border rounded"
                         required
                    />

                    <select
                         name="category"
                         value={form.category}
                         onChange={handleChange}
                         className="w-full p-2 border rounded"
                         required
                    >
                         <option value="">Select Category</option>
                         <option value="Electronics">Electronics</option>
                         <option value="Furniture">Furniture</option>
                         <option value="Books">Books</option>
                         <option value="Clothing">Clothing</option>
                         <option value="Others">Others</option>
                    </select>

                    <div>
                         <label className="block mb-1 text-sm text-gray-600">Upload New Images (optional)</label>
                         <input
                              type="file"
                              multiple
                              onChange={handleFileChange}
                              className="w-full p-2 border rounded"
                         />
                    </div>

                    {existingImages.length > 0 && (
                         <div className="mt-3">
                              <p className="text-sm font-medium mb-1 text-gray-600">Existing Images:</p>
                              <div className="flex flex-wrap gap-2">
                                   {existingImages.map((img, i) => (
                                        <img
                                             key={i}
                                             src={`http://localhost:5000${img}`}
                                             alt="Existing"
                                             className="w-20 h-20 object-cover rounded border"
                                        />
                                   ))}
                              </div>
                         </div>
                    )}

                    <button
                         type="submit"
                         className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
                    >
                         Update Product
                    </button>
               </form>
          </div>
     );
};

export default EditProduct;
