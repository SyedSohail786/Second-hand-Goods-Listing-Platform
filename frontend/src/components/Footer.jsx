import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold">2D Hand Products</h2>
          <p className="text-gray-300">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex space-x-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/my-products" className="hover:underline">My Products</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
