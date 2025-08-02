const { body } = require('express-validator');

// Validation rules for user registration
const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('role')
    .optional()
    .isIn(['super_admin', 'content_manager', 'examiner'])
    .withMessage('Invalid role specified')
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Remember me must be a boolean')
];

// Validation rules for profile update
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
];

// Validation rules for password change
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// Validation rules for test creation
const validateTestCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Test title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  
  body('totalTime')
    .optional()
    .isInt({ min: 30, max: 300 })
    .withMessage('Total time must be between 30 and 300 minutes'),
  
  body('duration')
    .optional()
    .isInt({ min: 30, max: 300 })
    .withMessage('Test duration must be between 30 and 300 minutes'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
];

// Validation rules for test updates (more flexible)
const validateTestUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Test title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  
  body('totalTime')
    .optional()
    .isInt({ min: 30, max: 300 })
    .withMessage('Total time must be between 30 and 300 minutes'),
  
  body('duration')
    .optional()
    .isInt({ min: 30, max: 300 })
    .withMessage('Test duration must be between 30 and 300 minutes'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),

  // Allow reading section updates
  body('reading')
    .optional()
    .isObject()
    .withMessage('Reading section must be an object'),
    
  body('reading.sections')
    .optional()
    .isArray()
    .withMessage('Reading sections must be an array'),
    
  // Allow listening section updates
  body('listening')
    .optional()
    .isObject()
    .withMessage('Listening section must be an object'),
    
  body('listening.sections')
    .optional()
    .isArray()
    .withMessage('Listening sections must be an array'),
    
  // Allow writing section updates
  body('writing')
    .optional()
    .isObject()
    .withMessage('Writing section must be an object'),
    
  body('writing.tasks')
    .optional()
    .isArray()
    .withMessage('Writing tasks must be an array'),
    
  // Allow speaking section updates
  body('speaking')
    .optional()
    .isObject()
    .withMessage('Speaking section must be an object'),
    
  body('speaking.parts')
    .optional()
    .isArray()
    .withMessage('Speaking parts must be an array')
];

// Validation rules for reading section
const validateReadingSection = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Section title must be between 3 and 200 characters'),
  
  body('passage')
    .trim()
    .isLength({ min: 100 })
    .withMessage('Passage must be at least 100 characters long'),
  
  body('suggestedTime')
    .optional()
    .isInt({ min: 5, max: 60 })
    .withMessage('Suggested time must be between 5 and 60 minutes')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateTestCreation,
  validateTestUpdate,
  validateReadingSection
}; 