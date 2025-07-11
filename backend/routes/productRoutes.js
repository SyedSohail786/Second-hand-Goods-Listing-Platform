const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const auth = require('../middleware/authMiddleware');
const {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts
} = require('../controllers/productController');
const { getBuyerInfo } = require('../controllers/productController');
const { buyProduct } = require('../controllers/productController');
const { deleteProduct } = require('../controllers/productController');
const { updateMyProduct } = require('../controllers/productController');

// POST new product
router.post('/', auth, upload.array('images', 5), createProduct);

// GET all products
router.get('/', getAllProducts);

// GET single product
router.get('/:id', getProductById);

// GET my products
router.get('/my/products', auth, getMyProducts);

router.post('/:id/buy', auth, buyProduct);

router.get('/:id/buyer', auth, getBuyerInfo);

router.delete('/:id', auth, deleteProduct);

router.put('/:id', auth, upload.array('images', 5), updateMyProduct);

module.exports = router;
