import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { FiShoppingBag, FiUser, FiDollarSign, FiCalendar, FiMapPin, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
const backend = import.meta.env.VITE_BACKEND_URI;

const AdminSales = () => {
  const { token } = useAuthStore();
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${backend}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filter products with buyer details (sold products)
        const soldProducts = res.data.filter((product) => 
          product.buyer && Object.keys(product.buyer).length > 0
        );
        setSales(soldProducts);
      } catch (err) {
        console.error('Failed to fetch sales', err);
        toast.error('Failed to load sales data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not sold yet';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">Sales Report</h2>
          <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            {sales.length} {sales.length === 1 ? 'Sale' : 'Sales'}
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiShoppingBag className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Sales Yet</h3>
            <p className="text-gray-500">When products are sold, they'll appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sales.map((sale) => (
              <motion.div
                key={sale._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{sale.productName}</h3>
                      <p className="text-sm text-gray-500">{sale.category}</p>
                    </div>
                    {sale.buyer ? (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Sold
                      </div>
                    ) : (
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Available
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <FiDollarSign className="mr-2 text-indigo-500" />
                      <span className="font-medium">₹{sale.price}</span>
                    </div>

                    {sale.buyer ? (
                      <>
                        <div className="flex items-start text-gray-700">
                          <FiUser className="mr-2 text-indigo-500 mt-1" />
                          <div>
                            <p className="font-medium">Buyer: {sale.buyer.name || 'Not available'}</p>
                            <p className="text-sm text-gray-500">{sale.buyer.phone || 'No contact'}</p>
                          </div>
                        </div>

                        <div className="flex items-start text-gray-700">
                          <FiMapPin className="mr-2 text-indigo-500 mt-1" />
                          <div>
                            <p className="font-medium">Delivery Address</p>
                            <p className="text-sm text-gray-500">{sale.address || 'Not specified'}</p>
                            {sale.city && <p className="text-sm text-gray-500">{sale.city}</p>}
                          </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <FiCalendar className="mr-2 text-indigo-500" />
                          <span>Sold on {formatDate(sale.buyer.buyDate)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <FiX className="mr-2" />
                        <span>This product is not sold yet</span>
                      </div>
                    )}

                    <div className="flex items-start text-gray-700">
                      <FiUser className="mr-2 text-indigo-500 mt-1" />
                      <div>
                        <p className="font-medium">Seller: {sale.seller?.name}</p>
                        <p className="text-sm text-gray-500">{sale.seller?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSales;