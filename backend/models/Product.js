const mongoose = require('mongoose');

const buyInfoSchema = new mongoose.Schema({
  name: String,
  phone: String,
  location: String,
  buyDate: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  address: String,
  mobile: String,
  purchaseDate: Date,
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyer: buyInfoSchema
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
