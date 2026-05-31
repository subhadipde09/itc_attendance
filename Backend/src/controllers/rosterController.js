const asyncHandler = require('../utils/asyncHandler');
const rosterService = require('../services/rosterService');
const audit = require('../utils/audit');

exports.generate = asyncHandler(async (req, res) => {
  const roster = await rosterService.generateRoster(req.user, req.body.startDate);
  await audit({ user: req.user, action: 'GENERATE_ROSTER', entity: 'Roster', metadata: { count: roster.length }, req });
  res.json({ success: true, roster });
});

exports.list = asyncHandler(async (req, res) => {
  const query = req.query.cycleStartDate ? { cycleStartDate: req.query.cycleStartDate } : {};
  const roster = await rosterService.listRoster(query);
  res.json({ success: true, roster });
});
