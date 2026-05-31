const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Replacement = require('../models/Replacement');
const { ATTENDANCE, SHIFTS, TEAMS } = require('../constants/enums');
const { toDateKey, currentShift } = require('../utils/date');

const dashboard = async (date = toDateKey()) => {
  const [employees, attendance, replacementsToday, replacementTrend] = await Promise.all([
    Employee.find({ active: true }),
    Attendance.findOne({ date }).populate('entries.employee'),
    Replacement.find({ date }).populate('absentEmployee replacementEmployee'),
    Replacement.aggregate([{ $group: { _id: '$date', count: { $sum: 1 } } }, { $sort: { _id: 1 } }, { $limit: 30 }]),
  ]);

  const entries = attendance?.entries || [];
  const presentEmployees = entries.filter((entry) => entry.status === ATTENDANCE.PRESENT).length;
  const absentEmployees = entries.filter((entry) => entry.status === ATTENDANCE.ABSENT).length;
  const shiftWiseManpower = Object.values(SHIFTS).map((shift) => ({
    shift,
    count: entries.filter((entry) => entry.shift === shift && entry.status === ATTENDANCE.PRESENT).length,
  }));
  const understaffedShifts = shiftWiseManpower.filter((item) => item.count < 5);
  const attendanceTrends = await Attendance.aggregate([
    { $unwind: '$entries' },
    { $group: { _id: { date: '$date', status: '$entries.status' }, count: { $sum: 1 } } },
    { $sort: { '_id.date': 1 } },
    { $limit: 120 },
  ]);
  const teamPerformance = TEAMS.map((team) => ({
    team,
    present: entries.filter((entry) => entry.team === team && entry.status === ATTENDANCE.PRESENT).length,
    absent: entries.filter((entry) => entry.team === team && entry.status === ATTENDANCE.ABSENT).length,
  }));

  return {
    date,
    currentShift: currentShift(),
    totalEmployees: employees.length,
    presentEmployees,
    absentEmployees,
    shiftWiseManpower,
    understaffedShifts,
    replacementsToday,
    replacementAssignmentsToday: replacementsToday.length,
    attendanceTrends,
    replacementTrend,
    teamPerformance,
    attendanceSaved: Boolean(attendance),
  };
};

module.exports = { dashboard };
