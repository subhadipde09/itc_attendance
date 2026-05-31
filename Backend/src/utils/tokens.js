const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

const signAccessToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role, email: user.email }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  });

const signRefreshToken = (user) => {
  const tokenId = crypto.randomUUID();
  const token = jwt.sign({ sub: user._id, tokenId }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });
  return { token, tokenId };
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { signAccessToken, signRefreshToken, hashToken };
