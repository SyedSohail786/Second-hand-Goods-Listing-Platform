const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { changePassword } = require('../controllers/userController');

// GET user profile
router.get('/profile', auth, getUserProfile);

// PUT update profile (name, phone, profile picture)
router.put('/profile', auth, upload.single('profilePicture'), updateUserProfile);

router.put('/change-password', auth, changePassword);


module.exports = router;
