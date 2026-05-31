const asyncHandler = require('../utils/asyncHandler');
const swapService = require('../services/swapService');
const audit = require('../utils/audit');

exports.create = asyncHandler(async (req, res) => {
  const swap = await swapService.createSwap({ ...req.body, user: req.user });
  await audit({ user: req.user, action: 'CREATE_SWAP', entity: 'ShiftSwap', entityId: swap._id, req });
  res.status(201).json({ success: true, swap });
});

exports.history = asyncHandler(async (_req, res) => {
  const swaps = await swapService.history();
  res.json({ success: true, swaps });
});
