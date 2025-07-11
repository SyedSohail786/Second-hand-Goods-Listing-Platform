const express = require('express');
const router = express.Router();
const admin = require('../middleware/adminMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET all users
router.get('/', admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(users);
});

// CREATE new user
router.post('/', admin, async (req, res) => {
  const { name, email, phone, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, phone, password: hashed });
  await user.save();
  res.status(201).json(user);
});

// UPDATE any user
router.put('/:id', admin, async (req, res) => {
  const { name, email, phone } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  await user.save();
  res.status(200).json(user);
});

// DELETE user
router.delete('/:id', admin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json({ message: 'User deleted' });
});

module.exports = router;
