const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');
const { validateSubmission } = require('../middleware/validation');

// @route   GET /api/submissions/my
// @desc    Get current user's test submissions
// @access  Private
router.get('/my', protect, submissionController.getMySubmissions);

// @route   GET /api/submissions/:submissionId
// @desc    Get submission details by ID
// @access  Private
router.get('/:submissionId', protect, submissionController.getSubmissionById);

// @route   PUT /api/submissions/:submissionId/progress
// @desc    Save test progress
// @access  Private
router.put('/:submissionId/progress', protect, validateSubmission.saveProgress, submissionController.saveProgress);

// @route   POST /api/submissions/:submissionId/submit
// @desc    Submit completed test
// @access  Private
router.post('/:submissionId/submit', protect, validateSubmission.submitTest, submissionController.submitTest);

// @route   PUT /api/submissions/:submissionId/pause
// @desc    Pause test submission
// @access  Private
router.put('/:submissionId/pause', protect, submissionController.pauseSubmission);

// @route   PUT /api/submissions/:submissionId/resume
// @desc    Resume paused test submission
// @access  Private
router.put('/:submissionId/resume', protect, submissionController.resumeSubmission);

// @route   DELETE /api/submissions/:submissionId
// @desc    Delete test submission (only if in progress)
// @access  Private
router.delete('/:submissionId', protect, submissionController.deleteSubmission);

// @route   GET /api/submissions/:submissionId/results
// @desc    Get detailed test results
// @access  Private
router.get('/:submissionId/results', protect, submissionController.getSubmissionResults);

// @route   POST /api/submissions/:submissionId/request-review
// @desc    Request manual review for writing/speaking sections
// @access  Private
router.post('/:submissionId/request-review', protect, submissionController.requestManualReview);

// @route   GET /api/submissions/:submissionId/feedback
// @desc    Get feedback for submission
// @access  Private
router.get('/:submissionId/feedback', protect, submissionController.getFeedback);

// @route   POST /api/submissions/:submissionId/report-issue
// @desc    Report technical issue with submission
// @access  Private
router.post('/:submissionId/report-issue', protect, validateSubmission.reportIssue, submissionController.reportIssue);

module.exports = router;
