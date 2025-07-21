const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

// @route   GET /api/stats/dashboard
// @desc    Get dashboard statistics for current user
// @access  Private
router.get('/dashboard', protect, statsController.getDashboardStats);

// @route   GET /api/stats/progress
// @desc    Get user progress statistics
// @access  Private
router.get('/progress', protect, statsController.getProgressStats);

// @route   GET /api/stats/performance
// @desc    Get detailed performance analytics
// @access  Private
router.get('/performance', protect, statsController.getPerformanceStats);

// @route   GET /api/stats/leaderboard
// @desc    Get leaderboard statistics
// @access  Public
router.get('/leaderboard', statsController.getLeaderboard);

// @route   GET /api/stats/test/:testId
// @desc    Get statistics for a specific test
// @access  Private
router.get('/test/:testId', protect, statsController.getTestStats);

// @route   GET /api/stats/comparison
// @desc    Compare user performance with averages
// @access  Private
router.get('/comparison', protect, statsController.getComparisonStats);

// @route   GET /api/stats/trends
// @desc    Get performance trends over time
// @access  Private
router.get('/trends', protect, statsController.getTrendStats);

// @route   GET /api/stats/skills
// @desc    Get skill-specific statistics
// @access  Private
router.get('/skills', protect, statsController.getSkillStats);

// @route   GET /api/stats/achievements
// @desc    Get user achievements and badges
// @access  Private
router.get('/achievements', protect, statsController.getAchievements);

module.exports = router;
