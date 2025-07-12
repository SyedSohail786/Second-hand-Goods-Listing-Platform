import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { FiShoppingCart, FiDollarSign, FiUser, FiCalendar, FiMapPin, FiPackage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const MyOrders = () => {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },[]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products/my/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4"
    >
      <div className={`mx-auto ${isMobile ? 'max-w-md' : 'max-w-6xl'}`}>
        <div className="flex items-center mb-8">
          <FiShoppingCart className="text-indigo-600 text-2xl mr-3" />
          <h2 className="text-2xl font-bold text-indigo-900">My Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <FiPackage className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-gray-500">Your purchased products will appear here</p>
          </div>
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {orders.map((order) => (
              <motion.div
                key={order._id}
                whileHover={{ y: -5 }}
                className="bg-white overflow-hidden shadow rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={`http://localhost:5000${order.images[0]}`}
                    alt={order.productName}
                    className="absolute w-full h-full object-contain p-4"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {order.productName}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <FiDollarSign className="text-indigo-600 mr-1" />
                    <span className="text-lg font-semibold text-indigo-600">₹{order.price}</span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center">
                      <FiUser className="mr-2 text-gray-500" />
                      <span>Seller: {order.seller?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-gray-500" />
                      <span>
                        Purchased: {new Date(order.buyer?.buyDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <FiMapPin className="mr-2 mt-1 text-gray-500" />
                      <span>Delivery: {order.buyer?.location}</span>
                    </div>
                  </div>

                  {order.status && (
                    <div className="mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyOrders;