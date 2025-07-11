const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  address: String,
  mobile: String,
  purchaseDate: Date,
  city: { type: String, required: true },           // ✅ New
  category: { type: String, required: true },       // ✅ New
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 buyer: {
  type: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    phone: String,
    location: String,
    buyDate: Date
  },
  default: null // 👈 this is important
}

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
