import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const UserProfile = () => {
  const { token, user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setName(res.data.name);
      setPhone(res.data.phone);
    } catch (err) {
      console.error('Profile fetch failed:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (file) formData.append('profilePicture', file);

      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Profile updated');
      fetchProfile();
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">My Profile</h2>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div className="text-center">
          <img
            src={`http://localhost:5000${profile.profilePicture || '/uploads/default.jpg'}`}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto border-2 border-purple-700 object-cover"
          />
          <p className="text-sm text-gray-600 mt-2">Joined on {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Change Profile Picture</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full" />
          </div>

          <button type="submit" className="bg-purple-700 text-white py-2 px-6 rounded hover:bg-purple-800">
            Update Profile
          </button>
        </form>

        <div className="text-sm text-gray-700">
          <strong>Email:</strong> {profile.email}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
