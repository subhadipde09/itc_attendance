const env = require('../config/env');

const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || 'Internal server error',
  };
  if (env.nodeEnv === 'development') payload.stack = err.stack;
  res.status(statusCode).json(payload);
};

module.exports = { notFound, errorHandler };
