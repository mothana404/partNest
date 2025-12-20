const Joi = require("joi");

const studentProfileValidate = Joi.object({
  // User fields
  fullName: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name must not exceed 100 characters",
  }),

  phoneNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .allow('')
    .messages({
      "string.pattern.base": "Phone number must be a valid format",
    }),

  location: Joi.string().min(2).max(200).optional().allow('').messages({
    "string.min": "Location must be at least 2 characters",
    "string.max": "Location must not exceed 200 characters",
  }),

  background: Joi.string().max(1000).optional().allow('').messages({
    "string.max": "Background must not exceed 1000 characters",
  }),

  // Student specific fields
  university: Joi.string().min(2).max(200).optional().messages({
    "string.min": "University name must be at least 2 characters",
    "string.max": "University name must not exceed 200 characters",
  }),

  major: Joi.string().min(2).max(200).optional().messages({
    "string.min": "Major must be at least 2 characters",
    "string.max": "Major must not exceed 200 characters",
  }),

  year: Joi.number()
    .integer()
    .min(1)
    .max(6)
    .optional()
    .allow(null)
    .messages({
      "number.base": "Year must be a number",
      "number.integer": "Year must be a whole number",
      "number.min": "Year must be at least 1",
      "number.max": "Year cannot exceed 6",
    }),

  gpa: Joi.number()
    .min(0)
    .max(4.0)
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      "number.base": "GPA must be a number",
      "number.min": "GPA cannot be less than 0",
      "number.max": "GPA cannot exceed 4.0",
    }),

  age: Joi.number()
    .integer()
    .min(16)
    .max(100)
    .optional()
    .allow(null)
    .messages({
      "number.base": "Age must be a number",
      "number.integer": "Age must be a whole number",
      "number.min": "Age must be at least 16",
      "number.max": "Age cannot exceed 100",
    }),

  about: Joi.string().max(2000).optional().allow('').messages({
    "string.max": "About section must not exceed 2000 characters",
  }),

  cvLink: Joi.string().uri().optional().allow('').messages({
    "string.uri": "CV link must be a valid URL",
  }),

  availability: Joi.boolean().optional().messages({
    "boolean.base": "Availability must be true or false",
  }),

  preferredJobTypes: Joi.array()
    .items(
      Joi.string().valid(
        "FULL_TIME",
        "PART_TIME", 
        "CONTRACT", 
        "INTERNSHIP", 
        "FREELANCE", 
        "REMOTE"
      )
    )
    .max(6)
    .optional()
    .messages({
      "array.max": "Cannot select more than 6 job types",
      "any.only": "Job type must be one of: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, REMOTE",
    }),

  preferredLocations: Joi.array()
    .items(Joi.string().min(2).max(100))
    .max(10)
    .optional()
    .messages({
      "array.max": "Cannot select more than 10 preferred locations",
      "string.min": "Each location must be at least 2 characters",
      "string.max": "Each location cannot exceed 100 characters",
    }),

  expectedSalaryMin: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .optional()
    .allow(null)
    .messages({
      "number.base": "Minimum expected salary must be a number",
      "number.integer": "Minimum expected salary must be a whole number",
      "number.min": "Minimum expected salary must be at least $1/hour",
      "number.max": "Minimum expected salary cannot exceed $10,000/hour",
    }),

  expectedSalaryMax: Joi.number()
    .integer()
    .min(Joi.ref('expectedSalaryMin'))
    .max(10000)
    .optional()
    .allow(null)
    .messages({
      "number.base": "Maximum expected salary must be a number",
      "number.integer": "Maximum expected salary must be a whole number",
      "number.min": "Maximum expected salary must be greater than or equal to minimum expected salary",
      "number.max": "Maximum expected salary cannot exceed $10,000/hour",
    }),

  // Related data
  skills: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().optional(),
        name: Joi.string().min(1).max(100).required(),
        level: Joi.string()
          .valid("Beginner", "Intermediate", "Advanced", "Expert")
          .optional()
          .allow(''),
        yearsOfExp: Joi.number()
          .integer()
          .min(0)
          .max(50)
          .optional()
          .allow(null),
      })
    )
    .max(20)
    .optional()
    .messages({
      "array.max": "Cannot have more than 20 skills",
    }),

  experiences: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().optional(),
        title: Joi.string().min(2).max(200).required(),
        companyName: Joi.string().min(2).max(200).optional().allow(''),
        description: Joi.string().max(2000).optional().allow(''),
        location: Joi.string().max(200).optional().allow(''),
        employmentType: Joi.string()
          .valid("Full-time", "Part-time", "Contract", "Internship", "Freelance")
          .optional()
          .allow(''),
        startDate: Joi.date().required(),
        endDate: Joi.date()
          .greater(Joi.ref('startDate'))
          .optional()
          .allow(null),
        isCurrent: Joi.boolean().optional(),
      })
    )
    .max(10)
    .optional()
    .messages({
      "array.max": "Cannot have more than 10 experiences",
    }),

  links: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().optional(),
        type: Joi.string()
          .valid("LinkedIn", "GitHub", "Portfolio", "Twitter", "Facebook", "Instagram", "YouTube", "Other")
          .required(),
        url: Joi.string().uri().required(),
        label: Joi.string().max(100).optional().allow(''),
      })
    )
    .max(10)
    .optional()
    .messages({
      "array.max": "Cannot have more than 10 links",
    }),
});

const CompanyProfileValidate = Joi.object({
  // User fields
  fullName: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name must not exceed 100 characters",
  }),

  phoneNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .allow('')
    .messages({
      "string.pattern.base": "Phone number must be a valid format",
    }),

  location: Joi.string().min(2).max(200).optional().allow('').messages({
    "string.min": "Location must be at least 2 characters",
    "string.max": "Location must not exceed 200 characters",
  }),

  background: Joi.string().max(1000).optional().allow('').messages({
    "string.max": "Background must not exceed 1000 characters",
  }),

  // Company specific fields
  companyName: Joi.string().min(2).max(200).optional().messages({
    "string.min": "Company name must be at least 2 characters",
    "string.max": "Company name must not exceed 200 characters",
  }),

  industry: Joi.string().min(2).max(100).optional().allow('').messages({
    "string.min": "Industry must be at least 2 characters",
    "string.max": "Industry must not exceed 100 characters",
  }),

  description: Joi.string().max(5000).optional().allow('').messages({
    "string.max": "Company description must not exceed 5000 characters",
  }),

  website: Joi.string().uri().optional().allow('').messages({
    "string.uri": "Website must be a valid URL",
  }),

  size: Joi.string()
    .valid(
      "1-10 employees",
      "11-50 employees", 
      "51-200 employees", 
      "201-500 employees", 
      "501-1000 employees", 
      "1000+ employees"
    )
    .optional()
    .allow('')
    .messages({
      "any.only": "Company size must be one of: 1-10 employees, 11-50 employees, 51-200 employees, 201-500 employees, 501-1000 employees, 1000+ employees",
    }),

  foundedYear: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional()
    .allow(null)
    .messages({
      "number.base": "Founded year must be a number",
      "number.integer": "Founded year must be a whole number",
      "number.min": "Founded year cannot be before 1800",
      "number.max": `Founded year cannot be after ${new Date().getFullYear()}`,
    }),

  contactEmail: Joi.string().email().optional().allow('').messages({
    "string.email": "Contact email must be a valid email address",
  }),

  contactPhone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .allow('')
    .messages({
      "string.pattern.base": "Contact phone must be a valid format",
    }),

  address: Joi.string().max(500).optional().allow('').messages({
    "string.max": "Address must not exceed 500 characters",
  }),

  // Related data
  links: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().optional(),
        type: Joi.string()
          .valid("Website", "LinkedIn", "Twitter", "Facebook", "Instagram", "YouTube", "Other")
          .required(),
        url: Joi.string().uri().required(),
        label: Joi.string().max(100).optional().allow(''),
      })
    )
    .max(10)
    .optional()
    .messages({
      "array.max": "Cannot have more than 10 links",
    }),
});

module.exports = {
  studentProfileValidate,
  CompanyProfileValidate,
};