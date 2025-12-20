const ApiResponse = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const formattedErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return ApiResponse.validationErrorResponse(res, formattedErrors);
    }

    req.body = value;
    next();
  };
};

module.exports = validate;