const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { validateUpload } = require('../middleware/validation');

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', protect, validateUpload.avatar, uploadController.uploadAvatar);

// @route   POST /api/upload/audio
// @desc    Upload audio file (speaking responses)
// @access  Private
router.post('/audio', protect, validateUpload.audio, uploadController.uploadAudio);

// @route   DELETE /api/upload/avatar
// @desc    Delete user avatar
// @access  Private
router.delete('/avatar', protect, uploadController.deleteAvatar);

// @route   DELETE /api/upload/audio/:filename
// @desc    Delete audio file
// @access  Private
router.delete('/audio/:filename', protect, uploadController.deleteAudio);

// @route   GET /api/upload/signed-url
// @desc    Get signed URL for large file uploads (if using cloud storage)
// @access  Private
router.get('/signed-url', protect, uploadController.getSignedUrl);

module.exports = router;
