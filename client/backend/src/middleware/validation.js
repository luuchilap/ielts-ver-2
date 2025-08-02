const { body, validationResult, query, param } = require('express-validator');

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Auth validations
exports.validateAuth = {
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('country')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Country name cannot exceed 100 characters'),
    body('targetScore')
      .optional()
      .isFloat({ min: 1, max: 9 })
      .withMessage('Target score must be between 1 and 9')
      .custom((value) => {
        if (value && value % 0.5 !== 0) {
          throw new Error('Target score must be in 0.5 increments');
        }
        return value;
      }),
    handleValidationErrors
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    body('rememberMe')
      .optional()
      .isBoolean()
      .withMessage('Remember me must be a boolean'),
    handleValidationErrors
  ],

  updateProfile: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage('Date of birth must be a valid date')
      .custom((value) => {
        if (value && new Date(value) > new Date()) {
          throw new Error('Date of birth cannot be in the future');
        }
        return value;
      }),
    body('phone')
      .optional()
      .custom((value) => {
        if (!value) return true; // Allow empty/undefined values
        // More flexible phone validation - allow various formats
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
        if (!phoneRegex.test(value)) {
          throw new Error('Please provide a valid phone number (7-20 digits, may include +, spaces, dashes, parentheses)');
        }
        return true;
      }),
    body('country')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Country name cannot exceed 100 characters'),
    body('targetScore')
      .optional()
      .isFloat({ min: 1, max: 9 })
      .withMessage('Target score must be between 1 and 9')
      .custom((value) => {
        if (value && value % 0.5 !== 0) {
          throw new Error('Target score must be in 0.5 increments');
        }
        return value;
      }),
    body('level')
      .optional()
      .isIn(['Beginner', 'Intermediate', 'Advanced'])
      .withMessage('Level must be Beginner, Intermediate, or Advanced'),
    body('preferences.language')
      .optional()
      .isIn(['en', 'vi', 'zh', 'es', 'fr'])
      .withMessage('Invalid language preference'),
    body('preferences.timezone')
      .optional()
      .isString()
      .withMessage('Timezone must be a string'),
    body('preferences.notifications.email')
      .optional()
      .isBoolean()
      .withMessage('Email notification preference must be a boolean'),
    body('preferences.notifications.testReminders')
      .optional()
      .isBoolean()
      .withMessage('Test reminder preference must be a boolean'),
    body('preferences.notifications.progressUpdates')
      .optional()
      .isBoolean()
      .withMessage('Progress update preference must be a boolean'),
    handleValidationErrors
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
      .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
          throw new Error('New password must be different from current password');
        }
        return value;
      }),
    handleValidationErrors
  ],

  forgotPassword: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    handleValidationErrors
  ],

  resetPassword: [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    handleValidationErrors
  ],

  verifyEmail: [
    body('token')
      .notEmpty()
      .withMessage('Verification token is required'),
    handleValidationErrors
  ],

  resendVerification: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    handleValidationErrors
  ]
};

// Test validations
exports.validateTest = {
  rating: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('review')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Review cannot exceed 1000 characters'),
    handleValidationErrors
  ]
};

// Submission validations
exports.validateSubmission = {
  saveProgress: [
    body('answers')
      .isObject()
      .withMessage('Answers must be an object'),
    body('currentSection')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Current section must be a non-negative integer'),
    body('currentQuestion')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Current question must be a non-negative integer'),
    body('timeSpent')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Time spent must be a non-negative integer'),
    handleValidationErrors
  ],

  submitTest: [
    body('answers')
      .isObject()
      .withMessage('Answers must be an object'),
    body('timeSpent')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Time spent must be a non-negative integer'),
    handleValidationErrors
  ],

  reportIssue: [
    body('issueType')
      .isIn(['technical', 'audio', 'content', 'other'])
      .withMessage('Issue type must be technical, audio, content, or other'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Issue description must be between 10 and 1000 characters'),
    body('severity')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Severity must be low, medium, high, or critical'),
    handleValidationErrors
  ]
};

// Upload validations
exports.validateUpload = {
  avatar: [
    (req, res, next) => {
      if (!req.files || !req.files.avatar) {
        return res.status(400).json({
          success: false,
          message: 'Avatar file is required'
        });
      }

      const file = req.files.avatar;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = parseInt(process.env.IMAGE_MAX_SIZE) || 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Only JPEG, PNG, and GIF images are allowed'
        });
      }

      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size cannot exceed ${maxSize / (1024 * 1024)}MB`
        });
      }

      next();
    }
  ],

  audio: [
    (req, res, next) => {
      if (!req.files || !req.files.audio) {
        return res.status(400).json({
          success: false,
          message: 'Audio file is required'
        });
      }

      const file = req.files.audio;
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a'];
      const maxSize = parseInt(process.env.AUDIO_MAX_SIZE) || 50 * 1024 * 1024; // 50MB

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Only MP3, WAV, and M4A audio files are allowed'
        });
      }

      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size cannot exceed ${maxSize / (1024 * 1024)}MB`
        });
      }

      body('type')
        .isIn(['speaking', 'listening'])
        .withMessage('Audio type must be speaking or listening')(req, res, next);
    }
  ]
};

// Query parameter validations
exports.validateQuery = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
  ],

  testFilters: [
    query('difficulty')
      .optional()
      .isIn(['Beginner', 'Intermediate', 'Advanced'])
      .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
    query('skills')
      .optional()
      .custom((value) => {
        const validSkills = ['Reading', 'Listening', 'Writing', 'Speaking'];
        const skills = Array.isArray(value) ? value : value.split(',');
        
        for (const skill of skills) {
          if (!validSkills.includes(skill.trim())) {
            throw new Error(`Invalid skill: ${skill}`);
          }
        }
        return value;
      }),
    query('category')
      .optional()
      .isIn(['Academic', 'General Training', 'Practice', 'Mock Test'])
      .withMessage('Invalid category'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'title', 'difficulty', 'totalAttempts', 'averageScore'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
    handleValidationErrors
  ]
};

// ID parameter validation
exports.validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

exports.validateTestId = [
  param('testId')
    .isMongoId()
    .withMessage('Invalid test ID format'),
  handleValidationErrors
];

exports.validateSubmissionId = [
  param('submissionId')
    .isMongoId()
    .withMessage('Invalid submission ID format'),
  handleValidationErrors
];
