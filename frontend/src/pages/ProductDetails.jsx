import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { FiArrowLeft, FiDollarSign, FiCalendar, FiUser, FiMapPin, FiTag, FiPhone, FiHome, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyForm, setBuyForm] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },[]);
  
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error('Failed to load product:', err);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Please login to buy this product');
      return navigate('/login');
    }

    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/products/${id}/buy`, buyForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product purchased successfully!');
      fetchProduct(); // refresh data to show buyer info
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error while purchasing');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="p-6 text-center">Product not found</div>;
  }

  const isSeller = product?.seller?._id === user?._id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4"
    >
      <div className={`mx-auto ${isMobile ? 'max-w-md' : 'max-w-4xl'}`}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              {/* Main Large Image */}
              <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`http://localhost:5000${product.images[mainImageIndex]}`}
                  alt="Main product"
                  className="w-full h-80 object-contain mx-auto"
                />
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImageIndex(index)}
                      className={`rounded-md overflow-hidden border-2 ${mainImageIndex === index ? 'border-indigo-500' : 'border-transparent'}`}
                    >
                      <img
                        src={`http://localhost:5000${img}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.productName}</h1>
              
              <div className="flex items-center mb-4">
                <span className="text-xl font-bold text-indigo-600">₹{product.price}</span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <FiTag className="text-gray-500 mr-2" />
                  <span className="text-gray-700">Category: {product.category}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    Listed on: {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiUser className="text-gray-500 mr-2" />
                  <span className="text-gray-700">Seller: {product.seller?.name}</span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="text-gray-500 mr-2" />
                  <span className="text-gray-700">Location: {product.city}</span>
                </div>
              </div>

              {/* Purchase Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                {product.buyer ? (
                  <div className="text-green-600 space-y-2">
                    <p className="font-semibold flex items-center">
                      <FiCheckCircle className="mr-2" />
                      Sold to:
                    </p>
                    <p>Name: {product.buyer.name}</p>
                    <p>Phone: {product.buyer.phone}</p>
                    <p>Address: {product.buyer.location}</p>
                  </div>
                ) : isSeller ? (
                  <div className="text-yellow-600 font-medium flex items-center">
                    <FiUser className="mr-2" />
                    This is your own listing
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-3">Buy This Product</h3>
                    <form onSubmit={handleBuy} className="space-y-3">
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          name="name"
                          placeholder="Your Name"
                          required
                          value={buyForm.name}
                          onChange={(e) => setBuyForm({ ...buyForm, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          name="phone"
                          placeholder="Phone Number"
                          required
                          value={buyForm.phone}
                          onChange={(e) => setBuyForm({ ...buyForm, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="relative">
                        <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          name="location"
                          placeholder="Your Address"
                          required
                          value={buyForm.location}
                          onChange={(e) => setBuyForm({ ...buyForm, location: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Processing...' : 'Confirm Purchase'}
                      </motion.button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;