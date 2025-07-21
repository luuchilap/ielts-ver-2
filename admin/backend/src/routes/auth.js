const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  validateProfileUpdate, 
  validatePasswordChange 
} = require('../middleware/validation');

// Public routes
router.post('/login', validateLogin, authController.login);

// Protected routes - require authentication
router.use(authenticateToken);

router.get('/profile', authController.getProfile);
router.put('/profile', validateProfileUpdate, authController.updateProfile);
router.put('/change-password', validatePasswordChange, authController.changePassword);
router.post('/logout', authController.logout);

// Admin only routes - require super admin role
router.post('/register', requireSuperAdmin, validateRegister, authController.register);

module.exports = router; 