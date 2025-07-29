import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">2dHand</h3>
            <p className="text-gray-400">
              Your trusted marketplace for buying and selling pre-loved items at great prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/busy_sohail?igsh=MWU1MHVpMTUzNmdwNQ==" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/syedsohail7867/" className="text-gray-400 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition">Browse Products</Link></li>
              <li><Link to="/add-product" className="text-gray-400 hover:text-white transition">Sell Now</Link></li>
              <li><Link to="/my-products" className="text-gray-400 hover:text-white transition">My Products</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/products?category=Electronics" className="text-gray-400 hover:text-white transition">Electronics</Link></li>
              <li><Link to="/products?category=Furniture" className="text-gray-400 hover:text-white transition">Furniture</Link></li>
              <li><Link to="/products?category=Clothing" className="text-gray-400 hover:text-white transition">Clothing</Link></li>
              <li><Link to="/products?category=Books" className="text-gray-400 hover:text-white transition">Books</Link></li>
              <li><Link to="/products?category=Others" className="text-gray-400 hover:text-white transition">Others</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="not-italic text-gray-400 space-y-2">
              <p>123 Market Street</p>
              <p>Bangalore, KA 560001</p>
              <p>Email: contact@2dHand.com</p>
              <p>Phone: +91 9876543210</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Digisnare. All rights reserved.
            <p>Developed by Syed Sohail with ❤️</p>
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</Link>
            <Link to="/faq" className="text-gray-400 hover:text-white text-sm transition">FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
