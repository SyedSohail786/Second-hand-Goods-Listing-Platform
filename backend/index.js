const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
     origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
     credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // for serving uploaded images

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const adminStatsRoute = require('./routes/adminStatsRoute');


// Route Setup
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// Home Test Route
app.get('/', (req, res) => {
  res.send('Second-Hand Product Listing Platform API Running...');
});
app.use('/api/users', userRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/stats', adminStatsRoute);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');

  // ✅ Create default admin
  const Admin = require('./models/Admin');
  const bcrypt = require('bcryptjs');

  async function createDefaultAdmin() {
    const existing = await Admin.findOne({ email: 'admin@email.com' });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin@123', 10);
      await new Admin({ email: 'admin@email.com', password: hashedPassword }).save();
      console.log('✅ Default admin created');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  }

  createDefaultAdmin();

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

