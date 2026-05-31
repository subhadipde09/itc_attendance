const asyncHandler = require('../utils/asyncHandler');
const attendanceService = require('../services/attendanceService');
const audit = require('../utils/audit');

exports.saveAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.saveAttendance({ entries: req.body.entries, date: req.body.date, user: req.user });
  await audit({ user: req.user, action: 'SAVE_ATTENDANCE', entity: 'Attendance', entityId: attendance._id, req });
  res.json({ success: true, attendance });
});

exports.recordAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.recordAttendance({ entries: req.body.entries, date: req.body.date, user: req.user });
  await audit({ user: req.user, action: 'RECORD_ATTENDANCE', entity: 'Attendance', entityId: attendance._id, req });
  res.json({ success: true, attendance });
});

exports.listAttendance = asyncHandler(async (req, res) => {
  const filter = req.query.date ? { date: req.query.date } : {};
  const attendance = await attendanceService.listAttendance(filter);
  res.json({ success: true, attendance });
});
