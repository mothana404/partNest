const Joi = require("joi");

const companySignInUp = Joi.object({
  address: Joi.string().max(200).required().messages({
    "string.empty": "Address is required",
    "string.max": "Address must not exceed 200 characters",
    "any.required": "Address is required",
  }),

  companyName: Joi.string().min(4).max(100).required().messages({
    "string.empty": "Company name is required",
    "string.min": "Company name must be at least 4 characters",
    "string.max": "Company name must not exceed 100 characters",
    "any.required": "Company name is required",
  }),

  description: Joi.string().max(1000).optional().messages({
    "string.max": "Description must not exceed 1000 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  fullName: Joi.string().min(4).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 4 characters",
    "string.max": "Full name must not exceed 100 characters",
    "any.required": "Full name is required",
  }),

  industry: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Industry must be at least 2 characters",
    "string.max": "Industry must not exceed 50 characters",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),

  phoneNumber: Joi.string().optional(),

  size: Joi.string().optional(),

  website: Joi.string().uri().optional().messages({
    "string.uri": "Please provide a valid website URL",
  }),

  foundedYear: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      "number.base": "Founded year must be a number",
      "number.integer": "Founded year must be a whole number",
      "number.min": "Founded year cannot be earlier than 1800",
      "number.max": `Founded year cannot be later than ${new Date().getFullYear()}`,
    }),
});

const usersSignIn = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),

  password: Joi.string().min(6).max(50).trim().required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

const studentSignUp = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),

  password: Joi.string().min(6).max(50).trim().required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),

  fullName: Joi.string().min(2).max(100).trim().required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 2 characters",
  }),

  phoneNumber: Joi.string()
    .pattern(/^\+?\d{7,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be valid",
    }),

  university: Joi.string().required().messages({
    "string.empty": "University is required",
  }),

  major: Joi.string().required().messages({
    "string.empty": "Major is required",
  }),

  year: Joi.number()
    .integer()
    .min(1900)
    .optional()
    .messages({
      "number.base": "Year must be a number",
      "number.min": "Year cannot be earlier than 1900",
    }),

  gpa: Joi.number().min(0).max(4).optional().messages({
    "number.base": "GPA must be a number",
    "number.min": "GPA cannot be less than 0",
    "number.max": "GPA cannot be more than 4",
  }),

  age: Joi.number().integer().min(15).max(100).optional().messages({
    "number.base": "Age must be a number",
    "number.min": "Age must be at least 15",
    "number.max": "Age cannot be more than 100",
  }),

  about: Joi.string().max(1000).optional().messages({
    "string.max": "About section cannot exceed 1000 characters",
  }),

  cvLink: Joi.string().uri().allow('').optional().messages({
    "string.uri": "CV link must be a valid URL",
  }),
});

module.exports = { companySignInUp, usersSignIn, studentSignUp };
