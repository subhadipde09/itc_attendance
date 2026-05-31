const Attendance = require('../models/Attendance');
const Replacement = require('../models/Replacement');
const AppError = require('../utils/appError');
const { dayName } = require('../utils/date');

const assertNotWeeklyOff = (employee, date) => {
  if (employee.weeklyOffDay === dayName(date)) {
    throw new AppError(`${employee.name} has mandatory weekly off on ${employee.weeklyOffDay}`, 400);
  }
};

const assertSingleShift = async (employeeId, date) => {
  const attendance = await Attendance.findOne({ date, 'entries.employee': employeeId });
  const replacement = await Replacement.findOne({ date, replacementEmployee: employeeId });
  if (attendance && replacement) {
    throw new AppError('Employee cannot work more than one shift daily', 400);
  }
};

const assertSwapValid = (employeeA, employeeB, date) => {
  if (employeeA._id.equals(employeeB._id)) throw new AppError('Cannot swap an employee with themselves', 400);
  assertNotWeeklyOff(employeeA, date);
  assertNotWeeklyOff(employeeB, date);
  if (employeeA.shift === employeeB.shift) throw new AppError('Employees already have the same shift', 400);
};

module.exports = { assertNotWeeklyOff, assertSingleShift, assertSwapValid };
