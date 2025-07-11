const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const auth = require('../middleware/authMiddleware');
const {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  buyProduct,
  getBuyerInfo,
  deleteProduct,
  updateMyProduct
} = require('../controllers/productController');

// ✅ POST new product (requires auth and images)
router.post('/', auth, upload.array('images', 5), createProduct);

// ✅ MUST COME BEFORE :id routes
router.get('/my/products', auth, getMyProducts);

// ✅ GET all products (public)
router.get('/', getAllProducts);

// ✅ GET a single product by ID
router.get('/:id', getProductById);

// ✅ Buy a product
router.post('/:id/buy', auth, buyProduct);

// ✅ Get buyer info (for seller only)
router.get('/:id/buyer', auth, getBuyerInfo);

// ✅ Delete product by ID (only seller can)
router.delete('/:id', auth, deleteProduct);

// ✅ Update product (only seller, with optional new images)
router.put('/:id', auth, upload.array('images', 5), updateMyProduct);

module.exports = router;
