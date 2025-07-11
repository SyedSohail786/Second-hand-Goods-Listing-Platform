import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  const COLORS = ['#7e22ce', '#facc15'];

  const salesChart = [
    { name: 'Sold', value: stats.totalSold },
    { name: 'Unsold', value: stats.totalProducts - stats.totalSold }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Users" value={stats.totalUsers} color="bg-purple-600" />
        <StatCard label="Total Products" value={stats.totalProducts} color="bg-indigo-600" />
        <StatCard label="Sold Products" value={stats.totalSold} color="bg-emerald-600" />
        <StatCard label="Revenue" value={`₹${stats.totalRevenue}`} color="bg-yellow-500" />
      </div>

      <div className="bg-white rounded shadow p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-center mb-4">Sales Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={salesChart}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {salesChart.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center space-x-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-600 inline-block rounded-full" />
            Sold
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-400 inline-block rounded-full" />
            Unsold
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className={`p-5 rounded shadow text-white ${color}`}>
    <h3 className="text-md font-medium">{label}</h3>
    <p className="text-3xl mt-2 font-bold">{value}</p>
  </div>
);

export default AdminDashboard;
