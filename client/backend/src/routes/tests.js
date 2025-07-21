const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { protect } = require('../middleware/auth');
const { validateTest } = require('../middleware/validation');

// @route   GET /api/tests
// @desc    Get all public tests with filtering, pagination, and search
// @access  Public
router.get('/', testController.getTests);

// @route   GET /api/tests/featured
// @desc    Get featured tests
// @access  Public
router.get('/featured', testController.getFeaturedTests);

// @route   GET /api/tests/popular
// @desc    Get popular tests
// @access  Public
router.get('/popular', testController.getPopularTests);

// @route   GET /api/tests/categories
// @desc    Get available test categories
// @access  Public
router.get('/categories', testController.getCategories);

// @route   GET /api/tests/skills
// @desc    Get available skills
// @access  Public
router.get('/skills', testController.getSkills);

// @route   GET /api/tests/:testId
// @desc    Get test details by ID
// @access  Public
router.get('/:testId', testController.getTestById);

// @route   POST /api/tests/:testId/start
// @desc    Start a test (create submission)
// @access  Private
router.post('/:testId/start', protect, testController.startTest);

// @route   GET /api/tests/:testId/preview
// @desc    Get test preview (limited info for non-authenticated users)
// @access  Public
router.get('/:testId/preview', testController.getTestPreview);

// @route   POST /api/tests/:testId/rate
// @desc    Rate a test
// @access  Private
router.post('/:testId/rate', protect, validateTest.rating, testController.rateTest);

// @route   GET /api/tests/:testId/ratings
// @desc    Get test ratings and reviews
// @access  Public
router.get('/:testId/ratings', testController.getTestRatings);

// @route   GET /api/tests/:testId/statistics
// @desc    Get test statistics
// @access  Public
router.get('/:testId/statistics', testController.getTestStatistics);

module.exports = router;
