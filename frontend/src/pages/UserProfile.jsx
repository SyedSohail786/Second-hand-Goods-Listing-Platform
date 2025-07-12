import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { FiUser, FiPhone, FiMail, FiCalendar, FiUpload, FiSave } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
const backend = import.meta.env.VITE_BACKEND_URI;

const UserProfile = () => {
  const { token, user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${backend}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setName(res.data.name);
      setPhone(res.data.phone || '');
    } catch (err) {
      console.error('Profile fetch failed:', err);
      toast.error('Failed to load profile');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (file) formData.append('profilePicture', file);

      await axios.put(`${backend}/api/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (err) {
      console.error('Profile update failed:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const imagePreview = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4"
    >
      <div className={`mx-auto ${isMobile ? 'max-w-md' : 'max-w-xl'}`}>
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">My Profile</h2>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="bg-indigo-600 p-6 text-center text-white">
            <div className="relative inline-block">
              <img
                src={imagePreview || `${backend}${profile.profilePicture || '/uploads/default.jpg'}`}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover mx-auto"
              />
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md">
                <FiUpload className="text-indigo-600" />
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
            <p className="mt-4 text-sm opacity-90">
              <FiCalendar className="inline mr-1" />
              Joined {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdate} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  readOnly
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-3 cursor-not-allowed border border-gray-300 rounded-lg transition"
                />
              </div>

              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 " />
                <input
                  value={profile.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setName(profile.name);
                  setPhone(profile.phone || '');
                  setFile(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;