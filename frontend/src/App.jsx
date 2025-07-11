import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminDashboard from './pages/AdminDashboard';
import AdminSales from './pages/AdminSales';
import UserProfile from './pages/UserProfile';
import MyProducts from './pages/MyProducts';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';
import Home from './pages/Home';
import Footer from './components/Footer';
import AddProduct from './pages/AddProduct';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
<Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/admin-login" element={<AdminLogin/>} />

        {/* User Routes */}
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/my-products" element={<MyProducts/>} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/add-product" element={<AddProduct />} />


        {/* Admin Routes */}
        <Route path="/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/users" element={<AdminUsers/>} />
        <Route path="/admin/products" element={<AdminProducts/>} />
        <Route path="/admin/sales" element={<AdminSales/>} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
