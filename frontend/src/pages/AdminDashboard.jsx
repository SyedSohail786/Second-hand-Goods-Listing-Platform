import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiUsers, FiBox, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSold: 0,
    totalRevenue: 0
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const salesData = [
    { name: 'Sold', value: stats.totalSold },
    { name: 'Unsold', value: stats.totalProducts - stats.totalSold }
  ];

  const monthlySales = [
    { name: 'Jan', sales: 35, revenue: 4200 },
    { name: 'Feb', sales: 42, revenue: 5800 },
    { name: 'Mar', sales: 28, revenue: 3900 },
    { name: 'Apr', sales: 51, revenue: 6800 },
    { name: 'May', sales: 47, revenue: 7200 },
    { name: 'Jun', sales: 39, revenue: 6100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-indigo-900">Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            label="Total Users" 
            value={stats.totalUsers} 
            icon={<FiUsers className="text-white" size={24} />}
            color="from-purple-600 to-purple-800"
          />
          <StatCard 
            label="Total Products" 
            value={stats.totalProducts} 
            icon={<FiBox className="text-white" size={24} />}
            color="from-blue-600 to-blue-800"
          />
          <StatCard 
            label="Sold Products" 
            value={stats.totalSold} 
            icon={<FiCheckCircle className="text-white" size={24} />}
            color="from-green-600 to-green-800"
          />
          <StatCard 
            label="Total Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={<FiDollarSign className="text-white" size={24} />}
            color="from-amber-500 to-amber-700"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Distribution */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Sales Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#7e22ce" 
                    radius={[4, 4, 0, 0]}
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Sold: {stats.totalSold}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Unsold: {stats.totalProducts - stats.totalSold}</span>
              </div>
            </div>
          </motion.div>

          {/* Monthly Sales Trend */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Monthly Sales Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="sales" 
                    name="Products Sold"
                    fill="#4f46e5" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="revenue" 
                    name="Revenue (₹)"
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className={`bg-gradient-to-r ${color} rounded-xl shadow-lg p-6 text-white`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium opacity-90">{label}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="p-3 bg-white bg-opacity-20 rounded-lg">
        {icon}
      </div>
    </div>
  </motion.div>
);

export default AdminDashboard;