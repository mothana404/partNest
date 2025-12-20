const { body, param } = require('express-validator');

const companyValidators = {
  updateProfile: [
    body('companyName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Company name must be between 2 and 100 characters'),
    
    body('industry')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Industry must be between 2 and 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    
    body('website')
      .optional()
      .trim()
      .isURL()
      .withMessage('Please provide a valid URL'),
    
    body('size')
      .optional()
      .trim(),
    
    body('foundedYear')
      .optional()
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage('Please provide a valid founded year'),
    
    body('contactEmail')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    
    body('contactPhone')
      .optional()
      .trim(),
    
    body('address')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Address must not exceed 200 characters'),
  ],

  // Get company by ID
  getById: [
    param('id')
      .isUUID()
      .withMessage('Invalid company ID format')
  ],
};

module.exports = companyValidators;