import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [sort, setSort] = useState('recent');
  const [category, setCategory] = useState('all');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setDisplayed(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Sort
    if (sort === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setDisplayed(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sort, category, products]);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-purple-800">Browse Products</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="recent">Recently Listed</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      {displayed.length === 0 ? (
        <p className="text-gray-600 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayed.map((product) => (
            <div key={product._id} className="bg-white shadow rounded p-4">
              <img
                src={`http://localhost:5000${product.images[0]}`}
                alt={product.productName}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-semibold">{product.productName}</h3>
              <p className="text-gray-700">₹{product.price}</p>
              <p className="text-sm text-gray-500">{product.category} • {product.city}</p>
              <Link
                to={`/product/${product._id}`}
                className="mt-3 inline-block bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              >
                Buy Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
