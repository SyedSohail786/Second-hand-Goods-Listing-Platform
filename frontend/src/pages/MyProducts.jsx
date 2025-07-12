import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPackage, FiCheckCircle, FiClock, FiPlus } from 'react-icons/fi';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { formatINR } from '../utils/formatINR';
const backend = import.meta.env.VITE_BACKEND_URI;

const MyProducts = () => {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backend}/api/products/my/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching my products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setDeleteLoading(id);
        await axios.delete(`${backend}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product deleted successfully');
        fetchMyProducts();
      } catch (err) {
        console.error('Delete failed:', err);
        toast.error('Failed to delete product');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 flex items-center mb-4 sm:mb-0">
            <FiPackage className="mr-3 text-indigo-600" />
            My Listed Products
          </h2>
          <Link
            to="/add-product"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FiPlus />
            Add New Product
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <FiPackage className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No products listed</h3>
            <p className="mt-1 text-gray-500">Get started by listing your first product.</p>
            <div className="mt-6">
              <Link
                to="/add-product"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <FiPlus className="mr-2" />
                New Product
              </Link>
            </div>
          </div>
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -5 }}
                className="bg-white overflow-hidden shadow rounded-xl transition-all duration-200 hover:shadow-lg flex flex-col h-full border border-gray-100"
              >
                {/* Image Container with Hover Effect */}
                <div className="relative group pt-8">
                  <div className="pt-[70%] bg-gray-50 overflow-hidden">
                    <img
                      src={`${backend}${product.images[0]}`}
                      alt={product.productName}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {product.buyer && (
                    <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Sold
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {product.productName}
                    </h3>
                    <div className="flex items-center text-lg font-bold text-indigo-600 whitespace-nowrap ml-2">
                      <FaIndianRupeeSign className="mr-1" />
                      {formatINR(product.price)}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                    {product.category}
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between space-x-2">
                      <Link
                        to={`/edit-product/${product._id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      >
                        <FiEdit2 className="mr-2" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleteLoading === product._id}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-70"
                      >
                        {deleteLoading === product._id ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <>
                            <FiTrash2 className="mr-2" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyProducts;