const AppError = require('../utils/appError');

const requireFields = (...fields) => (req, _res, next) => {
  const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === '');
  if (missing.length) return next(new AppError(`Missing required fields: ${missing.join(', ')}`, 400));
  next();
};

module.exports = { requireFields };
