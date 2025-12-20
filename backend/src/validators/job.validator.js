const Joi = require("joi");

const createJob = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    "string.empty": "Job title is required",
    "string.min": "Job title must be at least 3 characters",
    "string.max": "Job title must not exceed 200 characters",
    "any.required": "Job title is required",
  }),

  description: Joi.string().min(10).max(5000).required().messages({
    "string.empty": "Job description is required",
    "string.min": "Job description must be at least 10 characters",
    "string.max": "Job description must not exceed 5000 characters",
    "any.required": "Job description is required",
  }),

  location: Joi.string().min(2).max(200).required().messages({
    "string.empty": "Location is required",
    "string.min": "Location must be at least 2 characters",
    "string.max": "Location must not exceed 200 characters",
    "any.required": "Location is required",
  }),

  jobType: Joi.string()
    .valid("FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE", "REMOTE")
    .required()
    .messages({
      "any.only": "Job type must be one of: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, REMOTE",
      "any.required": "Job type is required",
    }),

  status: Joi.string()
    .valid("DRAFT", "ACTIVE", "PAUSED", "CLOSED")
    .default("DRAFT")
    .messages({
      "any.only": "Status must be one of: DRAFT, ACTIVE, PAUSED, CLOSED",
    }),

  requirements: Joi.string().min(10).max(2000).required().messages({
    "string.empty": "Job requirements are required",
    "string.min": "Requirements must be at least 10 characters",
    "string.max": "Requirements must not exceed 2000 characters",
    "any.required": "Job requirements are required",
  }),

  responsibilities: Joi.string().min(10).max(2000).required().messages({
    "string.empty": "Job responsibilities are required",
    "string.min": "Responsibilities must be at least 10 characters",
    "string.max": "Responsibilities must not exceed 2000 characters",
    "any.required": "Job responsibilities are required",
  }),

  benefits: Joi.string().max(1000).optional().allow('').messages({
    "string.max": "Benefits must not exceed 1000 characters",
  }),

  salaryMin: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .optional()
    .messages({
      "number.base": "Minimum salary must be a number",
      "number.integer": "Minimum salary must be a whole number",
      "number.min": "Minimum salary must be at least $1/hour",
      "number.max": "Minimum salary cannot exceed $10,000/hour",
    }),

  salaryMax: Joi.number()
    .integer()
    .min(Joi.ref('salaryMin'))
    .max(10000)
    .optional()
    .messages({
      "number.base": "Maximum salary must be a number",
      "number.integer": "Maximum salary must be a whole number",
      "number.min": "Maximum salary must be greater than or equal to minimum salary",
      "number.max": "Maximum salary cannot exceed $10,000/hour",
    }),

  salaryCurrency: Joi.string()
    .length(3)
    .uppercase()
    .default("USD")
    .optional()
    .messages({
      "string.length": "Currency code must be exactly 3 characters",
    }),

  experienceRequired: Joi.string()
    .valid(
      "No experience required",
      "0-1 years", 
      "1-3 years", 
      "3-5 years", 
      "5+ years"
    )
    .optional()
    .messages({
      "any.only": "Experience required must be one of: No experience required, 0-1 years, 1-3 years, 3-5 years, 5+ years",
    }),

  educationRequired: Joi.string()
    .valid(
      "High School",
      "Associate Degree", 
      "Bachelor's Degree", 
      "Master's Degree", 
      "PhD"
    )
    .optional()
    .messages({
      "any.only": "Education required must be one of: High School, Associate Degree, Bachelor's Degree, Master's Degree, PhD",
    }),

  applicationDeadline: Joi.date()
    .greater('now')
    .optional()
    .messages({
      "date.base": "Application deadline must be a valid date",
      "date.greater": "Application deadline must be in the future",
    }),

  maxApplications: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .optional()
    .messages({
      "number.base": "Maximum applications must be a number",
      "number.integer": "Maximum applications must be a whole number",
      "number.min": "Maximum applications must be at least 1",
      "number.max": "Maximum applications cannot exceed 10,000",
    }),

  categoryId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Category ID must be a valid UUID",
    }),

  tags: Joi.array()
    .items(Joi.string().min(1).max(50))
    .max(10)
    .optional()
    .messages({
      "array.max": "Cannot have more than 10 tags",
      "string.min": "Each tag must be at least 1 character",
      "string.max": "Each tag cannot exceed 50 characters",
    }),
});

const updateJob = Joi.object({
  title: Joi.string().min(3).max(200).optional().messages({
    "string.min": "Job title must be at least 3 characters",
    "string.max": "Job title must not exceed 200 characters",
  }),

  description: Joi.string().min(10).max(5000).optional().messages({
    "string.min": "Job description must be at least 10 characters",
    "string.max": "Job description must not exceed 5000 characters",
  }),

  location: Joi.string().min(2).max(200).optional().messages({
    "string.min": "Location must be at least 2 characters",
    "string.max": "Location must not exceed 200 characters",
  }),

  jobType: Joi.string()
    .valid("FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE", "REMOTE")
    .optional()
    .messages({
      "any.only": "Job type must be one of: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, REMOTE",
    }),

  status: Joi.string()
    .valid("DRAFT", "ACTIVE", "PAUSED", "CLOSED")
    .optional()
    .messages({
      "any.only": "Status must be one of: DRAFT, ACTIVE, PAUSED, CLOSED",
    }),

  requirements: Joi.string().min(10).max(2000).optional().messages({
    "string.min": "Requirements must be at least 10 characters",
    "string.max": "Requirements must not exceed 2000 characters",
  }),

  responsibilities: Joi.string().min(10).max(2000).optional().messages({
    "string.min": "Responsibilities must be at least 10 characters",
    "string.max": "Responsibilities must not exceed 2000 characters",
  }),

  benefits: Joi.string().max(1000).optional().allow('').messages({
    "string.max": "Benefits must not exceed 1000 characters",
  }),

  salaryMin: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .optional()
    .messages({
      "number.base": "Minimum salary must be a number",
      "number.integer": "Minimum salary must be a whole number",
      "number.min": "Minimum salary must be at least $1/hour",
      "number.max": "Minimum salary cannot exceed $10,000/hour",
    }),

  salaryMax: Joi.number()
    .integer()
    .min(Joi.ref('salaryMin'))
    .max(10000)
    .optional()
    .messages({
      "number.base": "Maximum salary must be a number",
      "number.integer": "Maximum salary must be a whole number",
      "number.min": "Maximum salary must be greater than or equal to minimum salary",
      "number.max": "Maximum salary cannot exceed $10,000/hour",
    }),

  salaryCurrency: Joi.string()
    .length(3)
    .uppercase()
    .optional()
    .messages({
      "string.length": "Currency code must be exactly 3 characters",
    }),

  experienceRequired: Joi.string()
    .valid(
      "No experience required",
      "0-1 years", 
      "1-3 years", 
      "3-5 years", 
      "5+ years"
    )
    .optional()
    .allow('')
    .messages({
      "any.only": "Experience required must be one of: No experience required, 0-1 years, 1-3 years, 3-5 years, 5+ years",
    }),

  educationRequired: Joi.string()
    .valid(
      "High School",
      "Associate Degree", 
      "Bachelor's Degree", 
      "Master's Degree", 
      "PhD"
    )
    .optional()
    .allow('')
    .messages({
      "any.only": "Education required must be one of: High School, Associate Degree, Bachelor's Degree, Master's Degree, PhD",
    }),

  applicationDeadline: Joi.date()
    .greater('now')
    .optional()
    .allow(null)
    .messages({
      "date.base": "Application deadline must be a valid date",
      "date.greater": "Application deadline must be in the future",
    }),

  maxApplications: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .optional()
    .allow(null)
    .messages({
      "number.base": "Maximum applications must be a number",
      "number.integer": "Maximum applications must be a whole number",
      "number.min": "Maximum applications must be at least 1",
      "number.max": "Maximum applications cannot exceed 10,000",
    }),

  categoryId: Joi.string()
    .uuid()
    .optional()
    .allow('')
    .messages({
      "string.guid": "Category ID must be a valid UUID",
    }),
});

module.exports = { 
  createJob,
  updateJob,
};