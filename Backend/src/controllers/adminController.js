const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { encrypt } = require('../utils/crypto');
const { ROLES } = require('../constants/enums');
const audit = require('../utils/audit');

const adminPayload = async (admin, secret) => ({
  id: admin._id,
  firstName: admin.firstName,
  lastName: admin.lastName,
  email: admin.email,
  role: admin.role,
  isActive: admin.isActive,
  lastLogin: admin.lastLogin,
  createdAt: admin.createdAt,
  qrCode: secret ? await QRCode.toDataURL(secret.otpauth_url) : undefined,
  manualSetupKey: secret?.base32,
});

exports.createAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError('Admin email already exists', 409);
  const secret = speakeasy.generateSecret({ name: `ITC Workforce (${email})` });
  const admin = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: ROLES.ADMIN,
    totpSecret: encrypt(secret.base32),
    createdBy: req.user._id,
  });
  await audit({ user: req.user, action: 'CREATE_ADMIN', entity: 'User', entityId: admin._id, req });
  res.status(201).json({ success: true, admin: await adminPayload(admin, secret) });
});

exports.listAdmins = asyncHandler(async (_req, res) => {
  const admins = await User.find({ role: ROLES.ADMIN }).sort({ createdAt: -1 });
  res.json({ success: true, admins });
});

exports.updateAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findOneAndUpdate(
    { _id: req.params.id, role: ROLES.ADMIN },
    { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email },
    { new: true, runValidators: true }
  );
  if (!admin) throw new AppError('Admin not found', 404);
  await audit({ user: req.user, action: 'UPDATE_ADMIN', entity: 'User', entityId: admin._id, req });
  res.json({ success: true, admin });
});

exports.setStatus = asyncHandler(async (req, res) => {
  const admin = await User.findOneAndUpdate({ _id: req.params.id, role: ROLES.ADMIN }, { isActive: req.body.isActive }, { new: true });
  if (!admin) throw new AppError('Admin not found', 404);
  await audit({ user: req.user, action: 'ADMIN_STATUS', entity: 'User', entityId: admin._id, req });
  res.json({ success: true, admin });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const admin = await User.findOne({ _id: req.params.id, role: ROLES.ADMIN }).select('+password');
  if (!admin) throw new AppError('Admin not found', 404);
  admin.password = req.body.password;
  await admin.save();
  await audit({ user: req.user, action: 'RESET_ADMIN_PASSWORD', entity: 'User', entityId: admin._id, req });
  res.json({ success: true, message: 'Password reset successfully' });
});
