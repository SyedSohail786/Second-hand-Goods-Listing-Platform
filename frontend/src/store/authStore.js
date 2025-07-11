import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  admin: JSON.parse(localStorage.getItem('admin')) || null,
  token: localStorage.getItem('token') || null,

  loginUser: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.removeItem('admin'); // clear admin if present
    set({ user: userData, token, admin: null });
  },

  loginAdmin: (adminData, token) => {
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('token', token);
    localStorage.removeItem('user'); // clear user if present
    set({ admin: adminData, token, user: null });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    set({ user: null, admin: null, token: null });
  }
}));

export default useAuthStore;
