import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { FiHome, FiUser, FiLogOut, FiPlusSquare, FiShoppingBag, FiUsers, FiPieChart, FiGrid, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-hot-toast';

// Light color scheme
const COLORS = {
  primary: 'bg-white',
  secondary: 'bg-gray-50',
  accent: 'bg-blue-500',
  text: 'text-gray-800',
  textHover: 'hover:text-blue-600',
  border: 'border-gray-200',
  glass: 'backdrop-blur-sm bg-white/80'
};

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const admin = useAuthStore((state) => state.admin);
  const logout = useAuthStore((state) => state.logout);
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully', {
      style: {
        background: COLORS.secondary,
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
      },
      iconTheme: {
        primary: COLORS.accent,
        secondary: COLORS.text,
      },
    });
    navigate('/');
    setMenuOpen(false);
  };

  useEffect(() => {
    const unlisten = () => {
      if (menuOpen) setMenuOpen(false);
    };
    return unlisten;
  }, [menuOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25 }}
      className={`${COLORS.primary} ${COLORS.text} ${scrolled ? 'shadow-md' : ''} fixed w-full z-50 border-b ${COLORS.border}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link 
              to="/" 
              className={`text-xl font-bold ${COLORS.textHover} transition-colors`}
              onClick={() => setMenuOpen(false)}
            >
              {admin ? '2D Admin' : '2D Products'}
            </Link>
          </motion.div>

          {!isMobile ? (
            <div className="flex space-x-6">
              {renderNavItems({ user, admin, handleLogout, isMobile: false })}
            </div>
          ) : (
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-md focus:outline-none"
              aria-label="Menu"
            >
              {menuOpen ? (
                <FiX className="h-6 w-6 text-blue-500" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobile && menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`${COLORS.secondary} fixed top-0 right-0 w-64 h-full z-50 shadow-xl border-l ${COLORS.border}`}
            >
              <div className="flex flex-col space-y-1 p-4">
                {renderNavItems({ 
                  user, 
                  admin, 
                  handleLogout, 
                  isMobile: true,
                  closeMenu: () => setMenuOpen(false)
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

function renderNavItems({ user, admin, handleLogout, isMobile, closeMenu }) {
  const items = admin
    ? [
        { to: '/dashboard', icon: <FiGrid />, text: 'Dashboard' },
        { to: '/admin/users', icon: <FiUsers />, text: 'Users' },
        { to: '/admin/products', icon: <FiShoppingBag />, text: 'Products' },
        { to: '/admin/sales', icon: <FiPieChart />, text: 'Sales' },
        { action: handleLogout, icon: <FiLogOut />, text: 'Logout' },
      ]
    : user
    ? [
        { to: '/', icon: <FiHome />, text: 'Home' },
        { to: '/my-products', icon: <FiShoppingBag />, text: 'My Products' },
        { to: '/add-product', icon: <FiPlusSquare />, text: 'List Product' },
        { to: '/profile', icon: <FiUser />, text: 'Profile' },
        { action: handleLogout, icon: <FiLogOut />, text: 'Logout' },
      ]
    : [
        { to: '/', icon: <FiHome />, text: 'Home' },
        { to: '/login', icon: <FiUser />, text: 'Login' },
        { to: '/admin-login', icon: <FiUser />, text: 'Admin Login' },
      ];

  return items.map((item, index) => (
    <motion.div
      key={item.text}
      initial={isMobile ? { x: 20, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: isMobile ? index * 0.05 : 0 }}
    >
      {item.to ? (
        <Link
          to={item.to}
          className={`flex items-center space-x-1 ${COLORS.text} ${
            isMobile ? 'w-full px-4 py-3 hover:bg-gray-100' : 'px-3 py-2 hover:bg-gray-50'
          } rounded-md ${COLORS.textHover} transition-colors`}
          onClick={closeMenu}
        >
          <span className="text-blue-500">{item.icon}</span>
          <span>{item.text}</span>
        </Link>
      ) : (
        <motion.button
          onClick={() => {
            item.action();
            if (isMobile) closeMenu();
          }}
          className={`flex items-center space-x-3 ${COLORS.text} ${
            isMobile ? 'w-full px-4 py-3 hover:bg-gray-100' : 'px-3 py-2 hover:bg-gray-50'
          } rounded-md ${COLORS.textHover} transition-colors`}
          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-blue-500">{item.icon}</span>
          <span>{item.text}</span>
        </motion.button>
      )}
    </motion.div>
  ));
}

export default Navbar;