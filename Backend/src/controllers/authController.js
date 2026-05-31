const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const env = require('../config/env');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { decrypt } = require('../utils/crypto');
const { signAccessToken, signRefreshToken, hashToken } = require('../utils/tokens');
const { ROLES } = require('../constants/enums');
const audit = require('../utils/audit');

const persistRefreshToken = async (user, token, tokenId) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ user: user._id, tokenHash: hashToken(token), tokenId, expiresAt });
};

const publicUser = (user) => ({
  id: user._id,
  email: user.email,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password +totpSecret');
  if (!user || !user.isActive || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.role === ROLES.ADMIN) {
    return res.json({
      success: true,
      requiresTotp: true,
      tempToken: jwt.sign({ sub: user._id, purpose: 'TOTP' }, env.jwtAccessSecret, { expiresIn: '5m' }),
    });
  }

  user.lastLogin = new Date();
  await user.save();
  const accessToken = signAccessToken(user);
  const refresh = signRefreshToken(user);
  await persistRefreshToken(user, refresh.token, refresh.tokenId);
  await audit({ user, action: 'LOGIN', entity: 'User', entityId: user._id, req });
  res.json({ success: true, accessToken, refreshToken: refresh.token, user: publicUser(user) });
});

exports.verifyTotp = asyncHandler(async (req, res) => {
  const { tempToken, token } = req.body;
  let payload;
  try {
    payload = jwt.verify(tempToken, env.jwtAccessSecret);
  } catch (_error) {
    throw new AppError('TOTP session expired', 401);
  }
  const user = await User.findById(payload.sub).select('+totpSecret');
  if (!user || user.role !== ROLES.ADMIN) throw new AppError('Invalid TOTP session', 401);
  const verified = speakeasy.totp.verify({
    secret: decrypt(user.totpSecret),
    encoding: 'base32',
    token,
    window: 1,
  });
  if (!verified) throw new AppError('Invalid authenticator code', 401);

  user.lastLogin = new Date();
  await user.save();
  const accessToken = signAccessToken(user);
  const refresh = signRefreshToken(user);
  await persistRefreshToken(user, refresh.token, refresh.tokenId);
  await audit({ user, action: 'LOGIN_TOTP', entity: 'User', entityId: user._id, req });
  res.json({ success: true, accessToken, refreshToken: refresh.token, user: publicUser(user) });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token is required', 400);
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch (_error) {
    throw new AppError('Invalid refresh token', 401);
  }
  const stored = await RefreshToken.findOne({ tokenHash: hashToken(refreshToken), tokenId: payload.tokenId, revoked: false });
  if (!stored || stored.expiresAt < new Date()) throw new AppError('Refresh token is expired or revoked', 401);
  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new AppError('User is inactive', 401);
  res.json({ success: true, accessToken: signAccessToken(user), user: publicUser(user) });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await RefreshToken.findOneAndUpdate({ tokenHash: hashToken(refreshToken) }, { revoked: true });
  res.json({ success: true });
});
