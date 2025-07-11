import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const MyOrders = () => {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/my/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">🛒 My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">You haven’t purchased any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded shadow p-4 bg-white">
              <img
                src={`http://localhost:5000${order.images[0]}`}
                alt={order.productName}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-bold">{order.productName}</h3>
              <p className="text-gray-700">₹{order.price}</p>
              <p className="text-gray-600">Seller: {order.seller?.name}</p>
              <p className="text-sm text-gray-500 mt-2">
                Purchased on: {new Date(order.buyer?.buyDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Delivery Address: {order.buyer?.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
