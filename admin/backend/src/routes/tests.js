const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');
const { authenticateToken, requireContentManager } = require('../middleware/auth');
const { validateTestCreation } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Get all tests (with pagination and filtering)
router.get('/', testController.getAllTests);

// Get test statistics
router.get('/stats', testController.getTestStats);

// Get test by ID
router.get('/:id', testController.getTestById);

// Routes that require content manager role
router.use(requireContentManager);

// Create new test
router.post('/', validateTestCreation, testController.createTest);

// Update test
router.put('/:id', validateTestCreation, testController.updateTest);

// Delete test
router.delete('/:id', testController.deleteTest);

// Duplicate test
router.post('/:id/duplicate', testController.duplicateTest);

// Change test status
router.patch('/:id/status', testController.changeTestStatus);

module.exports = router; 