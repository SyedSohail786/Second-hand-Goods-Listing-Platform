import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const AdminSales = () => {
  const { token } = useAuthStore();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // ✅ Only sold products
        const sold = res.data.filter((p) => p.buyer !== null);
        setSales(sold);
      } catch (err) {
        console.error('Failed to fetch sales', err);
      }
    };

    fetchSales();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Sales Report</h2>

      {sales.length === 0 ? (
        <p className="text-gray-600">No products have been sold yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border bg-white rounded shadow">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="p-2">Product</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Address</th>
                <th>Sold On</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((item) => (
                <tr key={item._id} className="border-t text-sm text-gray-700">
                  <td className="p-2 font-medium">{item.productName}</td>
                  <td>{item.buyer?.name}</td>
                  <td>{item.seller?.name}</td>
                  <td>{item.address}</td>
                  <td>{new Date(item.buyer?.buyDate).toLocaleDateString()}</td>
                  <td>₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSales;
