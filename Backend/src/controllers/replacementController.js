const asyncHandler = require('../utils/asyncHandler');
const replacementService = require('../services/replacementService');
const audit = require('../utils/audit');

exports.suggestions = asyncHandler(async (req, res) => {
  const suggestions = await replacementService.getSuggestions(req.query.date);
  res.json({ success: true, suggestions });
});

exports.assign = asyncHandler(async (req, res) => {
  const replacement = await replacementService.assignReplacement({ ...req.body, user: req.user });
  await audit({ user: req.user, action: 'ASSIGN_REPLACEMENT', entity: 'Replacement', entityId: replacement._id, req });
  res.json({ success: true, replacement });
});
