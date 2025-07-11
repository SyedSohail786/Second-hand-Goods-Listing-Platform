import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

const MyProducts = () => {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/my/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching my products:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMyProducts();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">My Listed Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-600">You haven’t listed any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded shadow p-4 bg-white">
              <img
                src={`http://localhost:5000${product.images[0]}`}
                alt={product.productName}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-bold">{product.productName}</h3>
              <p className="text-gray-700 mb-2">₹{product.price}</p>
              {product.buyer ? (
                <p className="text-green-600 font-medium">✅ Sold to {product.buyer.name}</p>
              ) : (
                <p className="text-yellow-600 font-medium">🟡 Not Sold</p>
              )}

              <div className="mt-4 flex gap-4">
                <Link
                  to={`/edit-product/${product._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
