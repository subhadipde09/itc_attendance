const asyncHandler = require('../utils/asyncHandler');
const analyticsService = require('../services/analyticsService');

exports.dashboard = asyncHandler(async (req, res) => {
  const dashboard = await analyticsService.dashboard(req.query.date);
  res.json({ success: true, dashboard });
});
