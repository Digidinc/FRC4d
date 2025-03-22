/**
 * Error Handler Middleware
 * Centralizes error handling across the API
 */

const logger = require('../utils/logger');

// Custom error classes
class ApiError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad request', errorCode = 'BAD_REQUEST') {
    super(message, 400, errorCode);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
    super(message, 401, errorCode);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', errorCode = 'FORBIDDEN') {
    super(message, 403, errorCode);
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', errorCode = 'NOT_FOUND') {
    super(message, 404, errorCode);
  }
}

class ConflictError extends ApiError {
  constructor(message = 'Conflict', errorCode = 'CONFLICT') {
    super(message, 409, errorCode);
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', errorCode = 'INTERNAL_ERROR') {
    super(message, 500, errorCode);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Default to 500 internal server error if status code not specified
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_ERROR';
  
  // Log error details
  if (statusCode >= 500) {
    logger.error(err.message, {
      error: err,
      path: req.path,
      method: req.method,
      ip: req.ip,
      stack: err.stack
    });
  } else {
    logger.warn(err.message, {
      error: err,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
  }

  // Capture request details for debugging
  const requestDetails = {
    path: req.path,
    method: req.method,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString()
  };

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      code: errorCode,
      request: process.env.NODE_ENV === 'development' ? requestDetails : undefined,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

// 404 handler middleware - for routes that don't exist
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Cannot ${req.method} ${req.path}`);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError
};