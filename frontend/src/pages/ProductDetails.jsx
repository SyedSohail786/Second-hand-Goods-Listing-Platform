import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [buyForm, setBuyForm] = useState({
    name: '',
    phone: '',
    location: ''
  });

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error('Failed to load product:', err);
    }
  };

  const handleBuy = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please login to buy this product');
      return navigate('/login');
    }

    try {
      await axios.post(`http://localhost:5000/api/products/${id}/buy`, buyForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product bought successfully!');
      fetchProduct(); // refresh data to show buyer info
    } catch (err) {
      alert(err.response?.data?.message || 'Error while buying');
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  const isSeller = product?.seller?._id === user?._id;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-purple-800 mb-4">{product.productName}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Info */}
        <div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000${img}`}
                alt="product"
                className="w-full h-40 object-cover rounded"
              />
            ))}
          </div>

          <p className="text-lg font-semibold mb-2">₹{product.price}</p>
          <p className="mb-2">{product.description}</p>
          <p className="text-sm text-gray-600">
            📅 Listed on: {new Date(product.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">👤 Seller: {product.seller?.name}</p>
          <p className="text-sm text-gray-600">📍 Address: {product.address}</p>
          <p className="text-sm text-gray-600">🏙️ City: {product.city}</p>
          <p className="text-sm text-gray-600">🏷️ Category: {product.category}</p>
        </div>

        {/* Buy or Sold Block */}
        <div className="bg-white p-4 rounded shadow">
          {product.buyer ? (
            <div className="text-green-600">
              <p className="font-semibold text-lg">✅ Already sold to:</p>
              <p>Name: {product.buyer.name}</p>
              <p>Phone: {product.buyer.phone}</p>
              <p>Location: {product.buyer.location}</p>
            </div>
          ) : isSeller ? (
            <div className="text-yellow-600 font-medium text-center">
              ⚠️ You cannot buy your own product.
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2">Buy This Product</h3>
              <form onSubmit={handleBuy} className="space-y-3">
                <input
                  name="name"
                  placeholder="Your Name"
                  required
                  value={buyForm.name}
                  onChange={(e) => setBuyForm({ ...buyForm, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  name="phone"
                  placeholder="Phone"
                  required
                  value={buyForm.phone}
                  onChange={(e) => setBuyForm({ ...buyForm, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  name="location"
                  placeholder="Your Address"
                  required
                  value={buyForm.location}
                  onChange={(e) => setBuyForm({ ...buyForm, location: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
                >
                  Confirm Purchase
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
