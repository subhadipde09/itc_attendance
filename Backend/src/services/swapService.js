const Employee = require('../models/Employee');
const ShiftSwap = require('../models/ShiftSwap');
const AppError = require('../utils/appError');
const { assertSwapValid } = require('./complianceService');
const { toDateKey } = require('../utils/date');

const createSwap = async ({ employeeAId, employeeBId, date = toDateKey(), user }) => {
  const [employeeA, employeeB] = await Promise.all([
    Employee.findById(employeeAId),
    Employee.findById(employeeBId),
  ]);
  if (!employeeA || !employeeB) throw new AppError('Employee not found', 404);
  assertSwapValid(employeeA, employeeB, date);

  const swap = await ShiftSwap.create({
    date,
    employeeA: employeeA._id,
    employeeB: employeeB._id,
    fromShift: employeeA.shift,
    toShift: employeeB.shift,
    createdBy: user?._id,
  });

  await Promise.all([
    Employee.findByIdAndUpdate(employeeA._id, { shift: employeeB.shift }),
    Employee.findByIdAndUpdate(employeeB._id, { shift: employeeA.shift }),
  ]);

  return swap.populate('employeeA employeeB');
};

const history = () => ShiftSwap.find().populate('employeeA employeeB createdBy', 'name employeeId firstName lastName email').sort({ createdAt: -1 });

module.exports = { createSwap, history };
