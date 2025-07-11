import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const AdminUsers = () => {
  const { token } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [editId, setEditId] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', { headers });
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/admin/users/${editId}`, form, { headers });
      } else {
        await axios.post('http://localhost:5000/api/admin/users', form, { headers });
      }
      setForm({ name: '', email: '', phone: '', password: '' });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, phone: user.phone, password: '' });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers });
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>

      <form onSubmit={handleSubmit} className="space-y-3 bg-gray-100 p-4 rounded-md mb-6">
        <div className="flex gap-4">
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="p-2 border rounded w-full" required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>
        <div className="flex gap-4">
          <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="p-2 border rounded w-full" required />
          {!editId && (
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="p-2 border rounded w-full" required />
          )}
        </div>
        <button type="submit" className="bg-purple-700 text-white py-2 px-6 rounded">
          {editId ? 'Update User' : 'Create User'}
        </button>
      </form>

      <table className="w-full border text-sm">
        <thead className="bg-purple-700 text-white">
          <tr>
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td className="text-center space-x-2">
                <button onClick={() => handleEdit(u)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
