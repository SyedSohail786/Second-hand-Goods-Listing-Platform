const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/multer');

// GET all products (with buyer + seller)
router.get('/', admin, async (req, res) => {
  const products = await Product.find()
    .populate('seller', 'name email')
    .lean();
  res.status(200).json(products);
});

// CREATE product
router.post('/', admin, upload.array('images', 5), async (req, res) => {
  const {
    productName, description, price, address, mobile, purchaseDate, sellerId, city,
    category
  } = req.body;

  const images = req.files.map(file => `/uploads/${file.filename}`);

  const product = new Product({
    productName,
    description,
    price,
    address,
    mobile,
    purchaseDate,
    images,
    city,
    category,
    seller: sellerId
  });

  await product.save();
  res.status(201).json(product);
});

// UPDATE product
router.put('/:id', admin, upload.array('images', 5), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const {
    productName, description, price, address, mobile, purchaseDate, city, category
  } = req.body;

  product.productName = productName || product.productName;
  product.description = description || product.description;
  product.price = price || product.price;
  product.address = address || product.address;
  product.mobile = mobile || product.mobile;
  product.purchaseDate = purchaseDate || product.purchaseDate;
  product.city = city || product.city;           // ✅
  product.category = category || product.category;

  if (req.files.length > 0) {
    product.images = req.files.map(file => `/uploads/${file.filename}`);
  }

  await product.save();
  res.status(200).json(product);
});

// DELETE product
router.delete('/:id', admin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json({ message: 'Product deleted successfully' });
});

module.exports = router;
