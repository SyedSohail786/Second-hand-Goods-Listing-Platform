import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/formatINR';
import { FiCalendar } from 'react-icons/fi';
import Select from 'react-select';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [sort, setSort] = useState('recent');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Sort options for React Select
  const sortOptions = [
    { value: 'recent', label: 'Recently Listed' },
    { value: 'low-to-high', label: 'Price: Low to High' },
    { value: 'high-to-low', label: 'Price: High to Low' }
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Category options for React Select
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Books', label: 'Books' },
    { value: 'Others', label: 'Others' }
  ];

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setDisplayed(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }, []);
  }, [sort, category, products]);

  return (
    <div className="min-h-[calc(100vh-200px)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-indigo-800">Browse Products</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* React Select for Sort */}
            <div className="w-full sm:w-48">
              <Select
                options={sortOptions}
                value={sortOptions.find(option => option.value === sort)}
                onChange={(selectedOption) => setSort(selectedOption.value)}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Sort by..."
                isSearchable={false}
              />
            </div>

            {/* React Select for Category */}
            <div className="w-full sm:w-48">
              <Select
                options={categoryOptions}
                value={categoryOptions.find(option => option.value === category)}
                onChange={(selectedOption) => setCategory(selectedOption.value)}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Filter by category..."
                isSearchable={false}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayed.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={`http://localhost:5000${product.images[0]}`}
                    alt={product.productName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.productName}
                  </h3>
                  <p className="text-lg font-bold text-indigo-600 mb-2">
                    {formatINR(product.price)}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{product.category}</span>
                    <span>{product.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <FiCalendar className="mr-1" />
                    <span>Listed on {formatDate(product.createdAt)}</span>
                  </div>
                  <Link
                    to={`/product/${product._id}`}
                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;