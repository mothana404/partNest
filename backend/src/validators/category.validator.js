// In validators/category.validator.js
const Joi = require("joi");

const categoryName = Joi.object({
  name: Joi.string().min(4).max(100).required().messages({
    "string.empty": "category name is required",
    "string.min": "category name must be at least 4 characters",
    "string.max": "category name must not exceed 100 characters",
    "any.required": "category name is required",
  })
});

const categoryUpdate = Joi.object({
  name: Joi.string().min(4).max(100).optional().messages({
    "string.empty": "category name cannot be empty",
    "string.min": "category name must be at least 4 characters",
    "string.max": "category name must not exceed 100 characters",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean value",
  })
}).min(1).messages({
  "object.min": "At least one field (name or isActive) is required for update"
});

module.exports = { 
  categoryName,
  categoryUpdate
};