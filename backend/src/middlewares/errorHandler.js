const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  
  console.error({
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
      statusCode: err.statusCode,
    },
  });

  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
    const message = `${fieldName} already exists`;
    
    return errorResponse(res, 409, message);
  }

  if (err.code && err.code.startsWith('P')) {
    return errorResponse(res, 400, "Database operation failed");
  }

  if (err.isOperational) {
    return errorResponse(res, err.statusCode, err.message);
  }

  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Something went wrong';
    
  return errorResponse(res, err.statusCode, message);
};

module.exports = errorHandler;