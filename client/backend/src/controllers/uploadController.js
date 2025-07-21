const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const User = require('../models/User');

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        success: false,
        message: 'No avatar file provided'
      });
    }

    const avatarFile = req.files.avatar;
    const userId = req.user.id;

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExtension = path.extname(avatarFile.name);
    const fileName = `avatar_${userId}_${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Process image with Sharp (resize, compress)
    let processedBuffer;
    try {
      processedBuffer = await sharp(avatarFile.data)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toBuffer();
    } catch (sharpError) {
      console.error('Image processing error:', sharpError);
      return res.status(400).json({
        success: false,
        message: 'Invalid image file'
      });
    }

    // Save processed image
    await fs.writeFile(filePath, processedBuffer);

    // Delete old avatar if exists
    if (req.user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), 'uploads', 'avatars', path.basename(req.user.avatar));
      try {
        await fs.unlink(oldAvatarPath);
      } catch (error) {
        console.log('Could not delete old avatar:', error.message);
      }
    }

    // Update user with new avatar URL
    const avatarUrl = `/uploads/avatars/${fileName}`;
    await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        url: avatarUrl
      }
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
};

// @desc    Upload audio file
// @route   POST /api/upload/audio
// @access  Private
exports.uploadAudio = async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({
        success: false,
        message: 'No audio file provided'
      });
    }

    const audioFile = req.files.audio;
    const { type } = req.body; // 'speaking' or 'listening'
    const userId = req.user.id;

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'uploads', 'audio', type);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExtension = path.extname(audioFile.name);
    const fileName = `${type}_${userId}_${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Move file to upload directory
    await audioFile.mv(filePath);

    // Get file stats
    const stats = await fs.stat(filePath);
    const audioUrl = `/uploads/audio/${type}/${fileName}`;

    res.json({
      success: true,
      message: 'Audio uploaded successfully',
      data: {
        url: audioUrl,
        filename: fileName,
        size: stats.size,
        type: audioFile.mimetype
      }
    });

  } catch (error) {
    console.error('Upload audio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload audio'
    });
  }
};

// @desc    Delete user avatar
// @route   DELETE /api/upload/avatar
// @access  Private
exports.deleteAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.avatar) {
      return res.status(404).json({
        success: false,
        message: 'No avatar to delete'
      });
    }

    // Delete avatar file
    const avatarPath = path.join(process.cwd(), 'uploads', 'avatars', path.basename(user.avatar));
    try {
      await fs.unlink(avatarPath);
    } catch (error) {
      console.log('Could not delete avatar file:', error.message);
    }

    // Update user to remove avatar
    await User.findByIdAndUpdate(userId, { avatar: null });

    res.json({
      success: true,
      message: 'Avatar deleted successfully'
    });

  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete avatar'
    });
  }
};

// @desc    Delete audio file
// @route   DELETE /api/upload/audio/:filename
// @access  Private
exports.deleteAudio = async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = req.user.id;

    // Verify the filename belongs to the user (security check)
    if (!filename.includes(`_${userId}_`)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Determine audio type from filename
    const type = filename.startsWith('speaking_') ? 'speaking' : 'listening';
    const filePath = path.join(process.cwd(), 'uploads', 'audio', type, filename);

    try {
      await fs.unlink(filePath);
      res.json({
        success: true,
        message: 'Audio file deleted successfully'
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          success: false,
          message: 'Audio file not found'
        });
      }
      throw error;
    }

  } catch (error) {
    console.error('Delete audio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete audio file'
    });
  }
};

// @desc    Get signed URL for large file uploads (if using cloud storage)
// @route   GET /api/upload/signed-url
// @access  Private
exports.getSignedUrl = async (req, res) => {
  try {
    const { fileType, fileName } = req.query;
    const userId = req.user.id;

    // This is a placeholder for cloud storage integration (AWS S3, Google Cloud, etc.)
    // For now, return a local upload endpoint
    
    if (!fileType || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'File type and name are required'
      });
    }

    // Validate file type
    const allowedTypes = {
      'image/jpeg': 'avatar',
      'image/png': 'avatar',
      'image/gif': 'avatar',
      'audio/mpeg': 'audio',
      'audio/wav': 'audio',
      'audio/mp4': 'audio',
      'audio/m4a': 'audio'
    };

    if (!allowedTypes[fileType]) {
      return res.status(400).json({
        success: false,
        message: 'File type not allowed'
      });
    }

    // Generate a unique upload token/path
    const uploadToken = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const uploadPath = `/api/upload/${allowedTypes[fileType]}?token=${uploadToken}`;

    res.json({
      success: true,
      data: {
        uploadUrl: `${req.protocol}://${req.get('host')}${uploadPath}`,
        uploadToken,
        expiresIn: 3600 // 1 hour
      }
    });

  } catch (error) {
    console.error('Get signed URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate signed URL'
    });
  }
};

// Helper function to clean up old files
exports.cleanupOldFiles = async () => {
  try {
    const uploadDirs = [
      path.join(process.cwd(), 'uploads', 'avatars'),
      path.join(process.cwd(), 'uploads', 'audio', 'speaking'),
      path.join(process.cwd(), 'uploads', 'audio', 'listening')
    ];

    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    for (const dir of uploadDirs) {
      try {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime.getTime() < thirtyDaysAgo) {
            // Check if file is still referenced by users
            if (dir.includes('avatars')) {
              const user = await User.findOne({ avatar: { $regex: file } });
              if (!user) {
                await fs.unlink(filePath);
                console.log(`Cleaned up old avatar: ${file}`);
              }
            } else {
              // For audio files, we might want to check if they're referenced in submissions
              // For now, just delete old files
              await fs.unlink(filePath);
              console.log(`Cleaned up old audio file: ${file}`);
            }
          }
        }
      } catch (dirError) {
        console.error(`Error cleaning directory ${dir}:`, dirError.message);
      }
    }

  } catch (error) {
    console.error('Cleanup old files error:', error);
  }
};

// Schedule cleanup to run daily
if (process.env.NODE_ENV === 'production') {
  setInterval(exports.cleanupOldFiles, 24 * 60 * 60 * 1000); // Run daily
}
