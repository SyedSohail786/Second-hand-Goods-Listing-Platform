const express = require('express');
const router = express.Router();
const admin = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');

// GET admin dashboard stats
router.get('/', admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const soldProducts = await Product.find({ buyer: { $ne: null } });
    const totalSold = soldProducts.length;

    const totalRevenue = soldProducts.reduce((sum, product) => sum + product.price, 0);

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalSold,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

module.exports = router;
