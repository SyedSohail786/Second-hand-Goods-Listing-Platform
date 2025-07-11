import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const AdminProducts = () => {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    description: '',
    price: '',
    address: '',
    mobile: '',
    purchaseDate: '',
    city: '',
    category: '',
    sellerId: '',
    images: []
  });
  const [editId, setEditId] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  };

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) {
      if (key === 'images') {
        for (let i = 0; i < form.images.length; i++) {
          data.append('images', form.images[i]);
        }
      } else {
        data.append(key, form[key]);
      }
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/admin/products/${editId}`, data, { headers });
      } else {
        await axios.post(`http://localhost:5000/api/admin/products`, data, { headers });
      }

      setForm({
        productName: '',
        description: '',
        price: '',
        address: '',
        mobile: '',
        purchaseDate: '',
        city: '',
        category: '',
        sellerId: '',
        images: []
      });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      productName: product.productName,
      description: product.description,
      price: product.price,
      address: product.address,
      mobile: product.mobile,
      purchaseDate: product.purchaseDate?.split('T')[0],
      city: product.city || '',
      category: product.category || '',
      sellerId: product.seller?._id || '',
      images: []
    });
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Products</h2>

      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded space-y-3 mb-6">
        <div className="flex gap-4">
          <input name="productName" placeholder="Product Name" value={form.productName} onChange={handleChange} className="p-2 border rounded w-full" required />
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>
        <div className="flex gap-4">
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="p-2 border rounded w-full" />
          <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} className="p-2 border rounded w-full" />
        </div>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" />

        <div className="flex gap-4">
          <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} className="p-2 border rounded w-full" />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="p-2 border rounded w-full" />
        </div>

        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
          <option value="Others">Others</option>
        </select>

        <input name="sellerId" placeholder="Seller ID (User ID)" value={form.sellerId} onChange={handleChange} className="p-2 border rounded w-full" />
        <input type="file" name="images" multiple onChange={handleFileChange} />

        <button className="bg-purple-700 text-white py-2 px-6 rounded">
          {editId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead className="bg-purple-700 text-white">
          <tr>
            <th className="p-2">Product</th>
            <th>Price</th>
            <th>Seller</th>
            <th>Buyer</th>
            <th>Category</th>
            <th>City</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.productName}</td>
              <td>₹{p.price}</td>
              <td>{p.seller?.name} ({p.seller?.email})</td>
              <td>
                {p.buyer ? (
                  <div>
                    {p.buyer.name} - {p.buyer.phone}<br />
                    {p.buyer.location}
                  </div>
                ) : '—'}
              </td>
              <td>{p.category}</td>
              <td>{p.city}</td>
              <td className="text-center space-x-2">
                <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
