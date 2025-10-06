const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/uploadController');
const { authenticateToken, requireContentManager } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Routes that require content manager role
router.use(requireContentManager);

// Upload audio file
router.post('/audio', 
  uploadController.uploadAudio, 
  uploadController.handleAudioUpload
);

// Get file info
router.get('/file/:filename', uploadController.getFileInfo);

// Delete file
router.delete('/file/:filename', uploadController.deleteFile);

module.exports = router;