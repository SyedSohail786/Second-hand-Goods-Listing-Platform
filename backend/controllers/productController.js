const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { productName, description, price, address, mobile, purchaseDate } = req.body;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const product = new Product({
      productName,
      description,
      price,
      address,
      mobile,
      purchaseDate,
      images: imagePaths,
      seller: req.user.id
    });

    await product.save();
    res.status(201).json({ message: 'Product listed successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error listing product', error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error getting product' });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your products' });
  }
};

exports.buyProduct = async (req, res) => {
  const { name, phone, location } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.buyer) return res.status(400).json({ message: 'Product already bought' });

    product.buyer = {
      name,
      phone,
      location,
      buyDate: new Date()
    };

    await product.save();

    res.status(200).json({ message: 'Product successfully bought', buyer: product.buyer });
  } catch (err) {
    res.status(500).json({ message: 'Error during purchase', error: err.message });
  }
};

exports.getBuyerInfo = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.seller.equals(req.user.id))
      return res.status(403).json({ message: 'Unauthorized to view buyer info' });

    if (!product.buyer) {
      return res.status(404).json({ message: 'This product has not been bought yet' });
    }

    res.status(200).json(product.buyer);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching buyer info', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if current user is the seller
    if (!product.seller.equals(req.user.id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this product' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};

exports.updateMyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.seller.equals(req.user.id))
      return res.status(403).json({ message: 'Unauthorized' });

    const { productName, description, price, address, mobile, purchaseDate } = req.body;

    product.productName = productName || product.productName;
    product.description = description || product.description;
    product.price = price || product.price;
    product.address = address || product.address;
    product.mobile = mobile || product.mobile;
    product.purchaseDate = purchaseDate || product.purchaseDate;

    if (req.files.length > 0) {
      product.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    await product.save();
    res.status(200).json({ message: 'Product updated', product });

  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};
