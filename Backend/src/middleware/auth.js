const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/appError');

const protect = async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('Authentication token is required', 401));

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findById(payload.sub).select('+totpSecret');
    if (!user || !user.isActive) return next(new AppError('User is inactive or no longer exists', 401));
    req.user = user;
    next();
  } catch (_error) {
    next(new AppError('Invalid or expired authentication token', 401));
  }
};

module.exports = { protect };
