import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

 const [form, setForm] = useState({
  productName: '',
  description: '',
  price: '',
  address: '',
  mobile: '',
  purchaseDate: '',
  city: '',
  category: ''
});

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }
      for (let file of images) {
        formData.append('images', file);
      }

      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Product listed successfully!');
      navigate('/my-products');
    } catch (err) {
      console.error('Product listing failed:', err);
      alert(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">List New Product</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <input
          name="productName"
          placeholder="Product Name"
          value={form.productName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="address"
          placeholder="Your Full Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="mobile"
          placeholder="Contact Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="purchaseDate"
          value={form.purchaseDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
          required
        />
        <input
  name="city"
  placeholder="City"
  value={form.city}
  onChange={handleChange}
  className="w-full p-2 border rounded"
  required
/>

<select
  name="category"
  value={form.category}
  onChange={handleChange}
  className="w-full p-2 border rounded"
  required
>
  <option value="">Select Category</option>
  <option value="Electronics">Electronics</option>
  <option value="Furniture">Furniture</option>
  <option value="Books">Books</option>
  <option value="Clothing">Clothing</option>
  <option value="Others">Others</option>
</select>


        <button
          type="submit"
          className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
        >
          List Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
